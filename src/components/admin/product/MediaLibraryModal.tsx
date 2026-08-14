import React from 'react';
import { MediaAssetPickerModal } from '../website/MediaAssetPickerModal';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string) => void;
  selectedUrl?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  selectedUrl,
}) => (
  <MediaAssetPickerModal
    isOpen={isOpen}
    onClose={onClose}
    onSelectMedia={onSelectMedia}
    currentValue={selectedUrl}
    defaultCategory="Products"
    title="Select Product Image"
  />
);

