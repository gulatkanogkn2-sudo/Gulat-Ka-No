import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useSupabase } from '../../hooks/useSupabase';
import { OrderService } from '../../services/orderService';
import { CustomerAvatarService } from '../../services/customerAvatarService';
import { systemSettingsService } from '../../services/systemSettingsService';
import { DigitalMemberCard } from '../../components/digitalMember/DigitalMemberCard';
import { OrderDetail } from '../../types/order';
import { TrackingResult } from '../../components/tracking/TrackingResult';
import {
  User,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  ShieldAlert,
  Zap,
  ExternalLink,
  LogOut,
  Edit3,
  Calendar,
  Phone,
  Hash,
  Award,
  CheckCircle2,
  AlertCircle,
  X,
  Camera,
  Trash2,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const { supabase, isConfigured } = useSupabase();
  const [recentOrders, setRecentOrders] = useState<OrderDetail[]>([]);

  // Digital Member ID Settings & Tier Config
  const [digitalIdSettings, setDigitalIdSettings] = useState(() => systemSettingsService.getSettings().digitalMemberId);
  const [tierConfig, setTierConfig] = useState(() => {
    const tiers = systemSettingsService.getSettings().customerTiers?.tiers || [];
    return tiers.find((t) => t.id === user?.tier) || null;
  });

  useEffect(() => {
    const unsubscribe = systemSettingsService.subscribe((settings) => {
      setDigitalIdSettings(settings.digitalMemberId);
      const tiers = settings.customerTiers?.tiers || [];
      setTierConfig(tiers.find((t) => t.id === user?.tier) || null);
    });
    return () => unsubscribe();
  }, [user?.tier]);
  
  // Avatar Display & Upload State
  const [avatarDisplayUrl, setAvatarDisplayUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [avatarActionLoading, setAvatarActionLoading] = useState<boolean>(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPreferredName, setEditPreferredName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editPrimaryAddress, setEditPrimaryAddress] = useState('');
  const [editCityProvince, setEditCityProvince] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const activeDeliveries = recentOrders.filter((order) =>
    !['DELIVERED', 'CANCELLED'].includes(String(order.fulfillmentStatus || order.status).toUpperCase())
  ).length;

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await OrderService.getRecentOrders(user?.email);
      setRecentOrders(orders);
    };
    loadOrders();
  }, [user]);

  // Resolve private signed URL or legacy external URL whenever user.avatarUrl changes
  useEffect(() => {
    let isCancelled = false;

    const resolveAvatar = async () => {
      if (!user?.avatarUrl) {
        setAvatarDisplayUrl(null);
        return;
      }

      setAvatarLoading(true);
      try {
        const resolved = await CustomerAvatarService.resolveAvatarDisplayUrl(supabase, user.avatarUrl);
        if (!isCancelled) {
          setAvatarDisplayUrl(resolved);
        }
      } catch {
        if (!isCancelled) {
          setAvatarDisplayUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setAvatarLoading(false);
        }
      }
    };

    resolveAvatar();

    return () => {
      isCancelled = true;
    };
  }, [user?.avatarUrl, supabase]);

  // Handle Photo File Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Reset file input so same file can be re-selected if needed
    e.target.value = '';

    const validation = CustomerAvatarService.validateAvatarFile(file);
    if (!validation.valid) {
      setAvatarMessage({ type: 'error', text: validation.error || 'Invalid image file.' });
      return;
    }

    if (!isConfigured || !supabase) {
      setAvatarMessage({ type: 'error', text: 'Supabase storage is not configured in this runtime.' });
      return;
    }

    setAvatarActionLoading(true);
    setAvatarMessage(null);

    try {
      await CustomerAvatarService.uploadAvatar(
        supabase,
        user.id,
        file,
        user.avatarUrl
      );

      await refreshProfile();
      setAvatarMessage({ type: 'success', text: 'Profile photo updated successfully.' });
      setTimeout(() => setAvatarMessage(null), 4000);
    } catch (err: any) {
      setAvatarMessage({ type: 'error', text: err.message || 'Failed to upload profile photo.' });
    } finally {
      setAvatarActionLoading(false);
    }
  };

  // Handle Photo Removal
  const handleRemovePhoto = async () => {
    if (!user || !user.avatarUrl) return;

    if (!isConfigured || !supabase) {
      setAvatarMessage({ type: 'error', text: 'Supabase storage is not configured in this runtime.' });
      return;
    }

    setAvatarActionLoading(true);
    setAvatarMessage(null);

    try {
      await CustomerAvatarService.removeAvatar(
        supabase,
        user.id,
        user.avatarUrl
      );

      await refreshProfile();
      setAvatarDisplayUrl(null);
      setAvatarMessage({ type: 'success', text: 'Profile photo removed.' });
      setTimeout(() => setAvatarMessage(null), 4000);
    } catch (err: any) {
      setAvatarMessage({ type: 'error', text: err.message || 'Failed to remove profile photo.' });
    } finally {
      setAvatarActionLoading(false);
    }
  };

  // Format Member Since date authoritative from created_at
  const formatMemberSince = (dateStr?: string) => {
    if (!dateStr) return 'Not Available';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Not Available';
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).toUpperCase();
    } catch {
      return 'Not Available';
    }
  };

  // Get Initials for Avatar Fallback
  const getInitials = (name?: string) => {
    if (!name) return 'GK';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Open Edit Profile Modal
  const openEditModal = () => {
    setEditFullName(user?.fullName || '');
    setEditPreferredName(user?.preferredName || '');
    setEditPhone(user?.phone || '');
    setEditBirthDate(user?.birthDate || '');
    setEditPrimaryAddress(user?.primaryAddress || '');
    setEditCityProvince(user?.cityProvince || '');
    setSaveError(null);
    setSaveSuccess(null);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setSaveError(null);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedFullName = editFullName.trim();
    const trimmedPreferredName = editPreferredName.trim();
    const trimmedPhone = editPhone.trim();
    const trimmedPrimaryAddress = editPrimaryAddress.trim();
    const trimmedCityProvince = editCityProvince.trim();

    // Validation: full_name not blank
    if (!trimmedFullName) {
      setSaveError('Full Name is required and cannot be blank.');
      return;
    }

    // Validation: phone not blank
    if (!trimmedPhone) {
      setSaveError('Phone Number is required and cannot be blank.');
      return;
    }

    // Validation: birth_date valid & not in future
    if (!editBirthDate) {
      setSaveError('Birth Date is required.');
      return;
    }

    const parsedBirthDate = new Date(editBirthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      setSaveError('Please provide a valid birth date.');
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedBirthDate > today) {
      setSaveError('Birth date cannot be in the future.');
      return;
    }

    // Validation: primary_address not blank
    if (!trimmedPrimaryAddress) {
      setSaveError('Primary Address is required and cannot be blank.');
      return;
    }

    setSaveError(null);
    setSaving(true);

    try {
      if (!isConfigured || !supabase) {
        throw new Error('Supabase client is not configured in this environment.');
      }

      // Safe update payload containing ONLY customer-editable personal fields
      const safePayload = {
        full_name: trimmedFullName,
        preferred_name: trimmedPreferredName || null,
        phone: trimmedPhone,
        birth_date: editBirthDate,
        primary_address: trimmedPrimaryAddress,
        city_province: trimmedCityProvince || null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(safePayload)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Refresh authoritative profile in AuthContext
      await refreshProfile();

      setSaveSuccess('Profile updated successfully.');
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(null);
      }, 1200);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Customer Profile & Orders"
      description="Manage your verified customer details, addresses, and order history."
    >
      <div className="space-y-8">
        {/* Hidden File Input for Avatar Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {/* Profile Header & Identity Card */}
        <Card variant="glass" className="p-6 border-[#00D9FF]/30 font-mono space-y-6">
          {avatarMessage && (
            <div
              className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between gap-2 ${
                avatarMessage.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2">
                {avatarMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{avatarMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setAvatarMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              {/* Customer Avatar Frame with Upload Action */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] overflow-hidden shadow-[0_0_20px_rgba(0,217,255,0.15)] relative">
                  {avatarLoading || avatarActionLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#00D9FF]" />
                  ) : avatarDisplayUrl ? (
                    <img
                      src={avatarDisplayUrl}
                      alt={user?.fullName || 'Customer Avatar'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={() => setAvatarDisplayUrl(null)}
                    />
                  ) : (
                    <span className="text-lg font-bold tracking-wider text-[#00D9FF]">
                      {getInitials(user?.fullName)}
                    </span>
                  )}
                </div>

                {/* Hover / Direct Button to Trigger Upload */}
                <button
                  type="button"
                  title="Upload Photo (JPEG, PNG, WEBP max 5MB)"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarActionLoading}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#0b101d] border border-[#00D9FF]/50 text-[#00D9FF] hover:bg-[#00D9FF]/20 flex items-center justify-center transition-colors shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-wide">
                    {user?.fullName || 'Customer'}
                  </h2>
                  {user?.preferredName && (
                    <span className="text-xs text-[#00D9FF] font-medium bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/20">
                      aka &quot;{user.preferredName}&quot;
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {user?.email || 'No email registered'}
                </p>

                {/* Photo Action Links */}
                <div className="flex items-center gap-3 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarActionLoading}
                    className="text-[#00D9FF] hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                  >
                    <Camera className="w-3 h-3" />
                    {user?.avatarUrl ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {user?.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={avatarActionLoading}
                      className="text-red-400 hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {user?.verificationStatus === 'VERIFIED' ? (
                <span className="text-[10px] text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VERIFIED CUSTOMER
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {user?.verificationStatus || 'UNVERIFIED'}
                </span>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={openEditModal}
                className="border-[#00D9FF]/40 text-[#00D9FF] hover:bg-[#00D9FF]/10 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1" />
                Edit Profile
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-white/20 text-slate-300 hover:text-white text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          </div>

          {/* Core Customer Account Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Hash className="w-3 h-3 text-[#00D9FF]" />
                Permanent Customer ID
              </span>
              <span className="text-sm font-bold text-white tracking-wider block">
                {user?.customerCode || 'Not Assigned'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#FF2ED1]" />
                Customer Tier
              </span>
              <span className="text-sm font-bold text-[#FF2ED1] tracking-wider block">
                {user?.tier || 'STANDARD'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                Member Since
              </span>
              <span className="text-sm font-bold text-slate-200 block">
                {formatMemberSince(user?.createdAt)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-[#00D9FF]" />
                Reward Balance
              </span>
              <span className="text-sm font-bold text-[#00D9FF] flex items-center gap-1">
                {user?.rewardPoints ?? 0} PTS
              </span>
            </div>
          </div>

          {/* Personal Information & Delivery Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                <User className="w-3.5 h-3.5 text-[#00D9FF]" />
                Personal Information
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Full Name:</span>
                  <span className="text-slate-200 font-semibold">{user?.fullName || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Preferred Name:</span>
                  <span className="text-slate-200">{user?.preferredName || 'None'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Phone Number:</span>
                  <span className="text-slate-200 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {user?.phone || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Birth Date:</span>
                  <span className="text-slate-200">{user?.birthDate || '—'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                <MapPin className="w-3.5 h-3.5 text-[#00D9FF]" />
                Primary Destination
              </h4>
              
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 block">Address:</span>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">
                    {user?.primaryAddress || 'No address specified'}
                  </p>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/5">
                  <span className="text-slate-500">City / Province:</span>
                  <span className="text-slate-200">{user?.cityProvince || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Digital Member ID Card Section */}
        <Card variant="glass" className="p-6 border-[#00D9FF]/30 font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Digital Member ID Card
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">
                  Your GKN digital member credential.
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-[#00D9FF] bg-[#00D9FF]/10 px-2.5 py-1 rounded-full border border-[#00D9FF]/20">
              LIVE CREDENTIAL
            </span>
          </div>

          {digitalIdSettings && !digitalIdSettings.enabled ? (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-center text-xs text-slate-400 font-sans">
              Digital Member ID is currently unavailable.
            </div>
          ) : (
            <div className="py-2 flex justify-center">
              <DigitalMemberCard
                profile={{
                  id: user?.id || 'customer-0',
                  fullName: user?.fullName || 'Registered Customer',
                  preferredName: user?.preferredName,
                  email: user?.email || '',
                  customerCode: user?.customerCode || 'GKN-000000',
                  tier: user?.tier || 'STANDARD',
                  verificationStatus: user?.verificationStatus || 'VERIFIED',
                  createdAt: user?.createdAt,
                }}
                settings={
                  digitalIdSettings || {
                    enabled: true,
                    frontBackgroundDim: 25,
                    backBackgroundDim: 40,
                    primaryColor: '#00D9FF',
                    secondaryColor: '#8B5CF6',
                    accentColor: '#FF2ED1',
                    showQrCode: true,
                    showBarcode: true,
                    issuerName: 'GKN',
                    backNotice:
                      'This digital member card identifies the registered GKN account holder. Present when account identification is requested.',
                  }
                }
                avatarDisplayUrl={avatarDisplayUrl}
                tierConfig={tierConfig}
                showFlipControls={true}
                showExportControls={true}
              />
            </div>
          )}
        </Card>

        {/* Order History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 font-mono">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#00D9FF]" />
              Order Allocations ({recentOrders.length})
            </h3>
            <Link
              to="/order-tracker"
              className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1"
            >
              <span>Open Tracker Search</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-black/20 border border-white/5 text-center font-mono space-y-2">
              <Package className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No batch order allocations recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentOrders.map((order) => (
                <TrackingResult key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-[#0b101d] border border-[#00D9FF]/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,217,255,0.15)] font-mono space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white tracking-wider flex items-center gap-2 uppercase">
                <Edit3 className="w-4 h-4 text-[#00D9FF]" />
                Edit Personal Profile
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Email Address (Read-Only)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2 h-10 rounded-xl bg-black/40 border border-white/10 text-slate-500 text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500">Email updates require customer support verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Official Full Name"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  required
                />

                <Input
                  label="Preferred Name (Optional)"
                  type="text"
                  placeholder="e.g. Alex"
                  value={editPreferredName}
                  onChange={(e) => setEditPreferredName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. 0917 123 4567"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                />

                <Input
                  label="Birth Date"
                  type="date"
                  value={editBirthDate}
                  onChange={(e) => setEditBirthDate(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Primary Address"
                type="text"
                placeholder="House/Unit #, Street, Barangay, Postal Code"
                value={editPrimaryAddress}
                onChange={(e) => setEditPrimaryAddress(e.target.value)}
                required
              />

              <Input
                label="City / Province (Optional)"
                type="text"
                placeholder="e.g. Makati City, Metro Manila"
                value={editCityProvince}
                onChange={(e) => setEditCityProvince(e.target.value)}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="outline"
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="border-white/20 text-slate-300 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
