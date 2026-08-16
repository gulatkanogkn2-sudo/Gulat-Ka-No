import { CustomerVerificationStatus } from './customer';

export interface DigitalMemberCardProfile {
  id: string;
  fullName: string;
  preferredName?: string;
  email: string;
  customerCode?: string;
  tier?: string;
  verificationStatus?: CustomerVerificationStatus | string;
  createdAt?: string;
  avatarUrl?: string;
}

export interface DigitalMemberIdSettings {
  enabled: boolean;
  brandLogoImage?: string;
  frontBackgroundImage?: string;
  backBackgroundImage?: string;
  frontBackgroundDim: number; // 0 - 100
  backBackgroundDim: number; // 0 - 100
  primaryColor: string; // e.g. '#00D9FF'
  secondaryColor: string; // e.g. '#8B5CF6'
  accentColor: string; // e.g. '#FF2ED1'
  showQrCode: boolean;
  showBarcode: boolean;
  issuerName: string;
  backNotice: string;
}
