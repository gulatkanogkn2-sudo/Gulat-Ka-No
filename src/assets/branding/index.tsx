import React from 'react';
import gknLogo from './gkn-logo.svg';
import gknHeroBackground from './gkn-hero-background.jpg';
import groupbuyBackground from './groupbuy-background.jpg';
import onhandBackground from './onhand-background.jpg';
import moqBackground from './moq-background.jpg';
import calculatorArtwork from './calculator-artwork.svg';
import coaArtwork from './coa-artwork.svg';
import protocolArtwork from './protocol-artwork.svg';
import priceListArtwork from './price-list-artwork.svg';
import chartPlaceholder from './chart-placeholder.svg';

export const BRANDING_ASSETS = {
  logo: gknLogo,
  heroArtwork: gknHeroBackground,
  groupbuy: groupbuyBackground,
  onhand: onhandBackground,
  moq: moqBackground,
  calculator: calculatorArtwork,
  coa: coaArtwork,
  protocol: protocolArtwork,
  priceList: priceListArtwork,
  chartPlaceholder: chartPlaceholder,
} as const;

/**
 * Image Fallback Handler
 * Prevents broken image icons across the app.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = BRANDING_ASSETS.logo
) {
  const target = event.currentTarget;
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
}

/**
 * Reusable Image Component with built-in Graceful Fallback
 */
export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = BRANDING_ASSETS.logo,
  onError,
  ...props
}) => {
  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      onError={(e) => {
        handleImageError(e, fallbackSrc);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
};
