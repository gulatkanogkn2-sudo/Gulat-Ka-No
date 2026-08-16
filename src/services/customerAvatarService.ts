import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

export const AVATAR_BUCKET = 'gkn-avatars';
export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface AvatarValidationResult {
  valid: boolean;
  error?: string;
  extension?: string;
}

export class CustomerAvatarService {
  /**
   * Validate avatar file for MIME type and maximum file size (5 MB)
   */
  static validateAvatarFile(file: File): AvatarValidationResult {
    if (!file) {
      return { valid: false, error: 'No file selected.' };
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit.`,
      };
    }

    const mime = file.type.toLowerCase();
    if (!ALLOWED_AVATAR_MIME_TYPES.includes(mime)) {
      return {
        valid: false,
        error: 'Unsupported image format. Only JPEG, PNG, and WEBP files are allowed.',
      };
    }

    let extension = 'webp';
    if (mime === 'image/jpeg') extension = 'jpg';
    else if (mime === 'image/png') extension = 'png';
    else if (mime === 'image/webp') extension = 'webp';

    return { valid: true, extension };
  }

  /**
   * Resolve an avatar URL for display.
   * If avatarPath starts with http:// or https://, returns it directly as legacy external URL.
   * Otherwise resolves a short-lived (1 hour) signed URL from private bucket `gkn-avatars`.
   */
  static async resolveAvatarDisplayUrl(
    supabase: SupabaseClient<Database> | null,
    avatarPath?: string | null
  ): Promise<string | null> {
    if (!avatarPath || !avatarPath.trim()) {
      return null;
    }

    const trimmed = avatarPath.trim();

    // Legacy external or full URL compatibility
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(trimmed, 3600); // 1 hour expiration

      if (error || !data?.signedUrl) {
        console.warn('[CustomerAvatarService] Failed to create signed URL:', error?.message);
        return null;
      }

      return data.signedUrl;
    } catch (err) {
      console.warn('[CustomerAvatarService] Error resolving signed URL:', err);
      return null;
    }
  }

  /**
   * Safe Upload Sequence:
   * 1. Validate file client-side.
   * 2. Upload new object to gkn-avatars under user.id folder (`${userId}/avatar-${Date.now()}.${ext}`).
   * 3. Update public.profiles.avatar_url = newObjectPath for authenticated user.
   * 4. If DB update fails, cleanup the newly uploaded Storage object to avoid orphans.
   * 5. If previous avatar was a private object in user's own folder, delete old object.
   * Returns the new object path.
   */
  static async uploadAvatar(
    supabase: SupabaseClient<Database>,
    userId: string,
    file: File,
    previousAvatarPath?: string | null
  ): Promise<{ objectPath: string }> {
    if (!userId || !userId.trim()) {
      throw new Error('Authenticated user ID is required.');
    }

    // Step A: Validate file
    const validation = this.validateAvatarFile(file);
    if (!validation.valid || !validation.extension) {
      throw new Error(validation.error || 'Invalid avatar file.');
    }

    // Step B: Upload NEW object under authenticated user's own UUID folder
    const timestamp = Date.now();
    const newObjectPath = `${userId}/avatar-${timestamp}.${validation.extension}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(newObjectPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Avatar upload failed: ${uploadError.message}`);
    }

    // Step C: Update public.profiles.avatar_url = newObjectPath
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        avatar_url: newObjectPath,
      })
      .eq('id', userId);

    // Step D: Rollback orphan if database update failed
    if (dbError) {
      // Clean up orphaned upload
      try {
        await supabase.storage.from(AVATAR_BUCKET).remove([newObjectPath]);
      } catch (cleanupErr) {
        console.error('[CustomerAvatarService] Failed to clean orphaned upload:', cleanupErr);
      }
      throw new Error(`Failed to update customer profile: ${dbError.message}`);
    }

    // Step E: Clean old private avatar if it belonged to user's folder
    if (
      previousAvatarPath &&
      !previousAvatarPath.startsWith('http://') &&
      !previousAvatarPath.startsWith('https://') &&
      previousAvatarPath.startsWith(`${userId}/`) &&
      previousAvatarPath !== newObjectPath
    ) {
      try {
        await supabase.storage.from(AVATAR_BUCKET).remove([previousAvatarPath]);
      } catch (cleanOldErr) {
        console.warn('[CustomerAvatarService] Failed to remove previous avatar:', cleanOldErr);
      }
    }

    return { objectPath: newObjectPath };
  }

  /**
   * Safe Remove Sequence:
   * 1. Update public.profiles.avatar_url = null for authenticated user.
   * 2. If previous avatar was a private object in user's own folder, delete old object.
   */
  static async removeAvatar(
    supabase: SupabaseClient<Database>,
    userId: string,
    previousAvatarPath?: string | null
  ): Promise<void> {
    if (!userId || !userId.trim()) {
      throw new Error('Authenticated user ID is required.');
    }

    // Step 1: Set profiles.avatar_url to null
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        avatar_url: null,
      })
      .eq('id', userId);

    if (dbError) {
      throw new Error(`Failed to remove avatar from profile: ${dbError.message}`);
    }

    // Step 2: Delete old object from Storage if it belongs to authenticated user's folder
    if (
      previousAvatarPath &&
      !previousAvatarPath.startsWith('http://') &&
      !previousAvatarPath.startsWith('https://') &&
      previousAvatarPath.startsWith(`${userId}/`)
    ) {
      try {
        await supabase.storage.from(AVATAR_BUCKET).remove([previousAvatarPath]);
      } catch (cleanOldErr) {
        console.warn('[CustomerAvatarService] Failed to delete removed avatar file:', cleanOldErr);
      }
    }
  }
}
