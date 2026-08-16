import React from 'react';
import { createRoot } from 'react-dom/client';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { DigitalMemberCardProfile, DigitalMemberIdSettings } from '../types/digitalMember';
import { CustomerTierConfig } from '../types/customerTier';
import { DigitalMemberCardFront } from '../components/digitalMember/DigitalMemberCardFront';
import { DigitalMemberCardBack } from '../components/digitalMember/DigitalMemberCardBack';

/**
 * Diagnostic results interface
 */
export interface ExportDiagnosticReport {
  testAVisibleCardState: 'A1_WORKS' | 'A2_SOLID_COLOR' | 'A_NO_VISIBLE_NODE';
  testAUniqueColors: number;
  testBOffscreenCardState: 'B1_WORKS' | 'B2_SOLID_COLOR';
  testBUniqueColors: number;
  rootCauseClass: 'FIXED_AND_WORKING' | 'CASE_1_OFFSCREEN_STAGING_ISSUE' | 'CASE_2_HTML_TO_IMAGE_ENGINE_FAILURE';
  stagingComputedStyles: {
    display: string;
    visibility: string;
    opacity: string;
    position: string;
    width: string;
    height: string;
  };
  captureNodeDiagnostics: {
    tagName: string;
    className: string;
    childElementCount: number;
    descendantCount: number;
    imageCount: number;
    svgCount: number;
    markerFound: boolean;
    boundingRect: { width: number; height: number };
  };
}

/**
 * Sanitize customer code or profile ID for export filenames
 */
export function formatExportFilename(
  customerCode: string | undefined | null,
  type: 'FRONT' | 'BACK' | 'MEMBER-ID',
  ext: 'png' | 'pdf'
): string {
  let cleanCode = (customerCode || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .toUpperCase();

  if (!cleanCode) {
    if (type === 'MEMBER-ID') return `GKN-MEMBER-ID.${ext}`;
    return `GKN-MEMBER-${type}.${ext}`;
  }

  if (cleanCode.startsWith('GKN-') || cleanCode.startsWith('GKN_')) {
    cleanCode = cleanCode.substring(4);
  }

  const prefix = `GKN-${cleanCode}`;
  if (type === 'MEMBER-ID') {
    return `${prefix}-MEMBER-ID.${ext}`;
  }
  return `${prefix}-${type}.${ext}`;
}

/**
 * Safely converts an image URL (avatar, background) to a data URL
 * to avoid CORS or cross-origin canvas taint issues during export.
 */
export async function urlToDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) return url;

  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('[DigitalMemberExport] Could not convert URL to data URL, using original:', err);
    return url;
  }
}

/**
 * In-browser pixel validation engine
 * Samples 15 distributed coordinates across the rendered card image canvas.
 * If all sampled coordinates yield the exact same color (e.g. solid #060912),
 * validation fails to prevent downloading blank/corrupt cards.
 */
export async function validatePngDataUrl(dataUrl: string): Promise<{
  valid: boolean;
  uniqueColorsCount: number;
  sampleColors: string[];
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.width || 428;
      const h = img.height || 270;
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ valid: false, uniqueColorsCount: 0, sampleColors: [] });
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Distributed sampling points across the card (15 key coordinates)
      const points = [
        { x: Math.floor(w * 0.1), y: Math.floor(h * 0.1) },
        { x: Math.floor(w * 0.5), y: Math.floor(h * 0.1) },
        { x: Math.floor(w * 0.9), y: Math.floor(h * 0.1) },
        { x: Math.floor(w * 0.25), y: Math.floor(h * 0.25) },
        { x: Math.floor(w * 0.75), y: Math.floor(h * 0.25) },
        { x: Math.floor(w * 0.1), y: Math.floor(h * 0.5) },
        { x: Math.floor(w * 0.5), y: Math.floor(h * 0.5) },
        { x: Math.floor(w * 0.9), y: Math.floor(h * 0.5) },
        { x: Math.floor(w * 0.25), y: Math.floor(h * 0.75) },
        { x: Math.floor(w * 0.75), y: Math.floor(h * 0.75) },
        { x: Math.floor(w * 0.1), y: Math.floor(h * 0.9) },
        { x: Math.floor(w * 0.5), y: Math.floor(h * 0.9) },
        { x: Math.floor(w * 0.9), y: Math.floor(h * 0.9) },
        { x: Math.floor(w * 0.35), y: Math.floor(h * 0.6) },
        { x: Math.floor(w * 0.65), y: Math.floor(h * 0.4) },
      ];

      const colors = new Set<string>();
      for (const p of points) {
        try {
          const pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
            .toString(16)
            .slice(1)}`;
          colors.add(hex.toUpperCase());
        } catch {
          // Ignore canvas read error
        }
      }

      const sampleColors = Array.from(colors);
      const valid = colors.size > 1; // Solid color = 1 unique color = INVALID
      resolve({ valid, uniqueColorsCount: colors.size, sampleColors });
    };

    img.onerror = () => {
      resolve({ valid: false, uniqueColorsCount: 0, sampleColors: [] });
    };

    img.src = dataUrl;
  });
}

/**
 * Helper to trigger browser file download for data URLs
 */
function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

interface RenderExportOptions {
  profile: DigitalMemberCardProfile;
  settings: DigitalMemberIdSettings;
  avatarDisplayUrl?: string | null;
  tierConfig?: CustomerTierConfig | null;
  side: 'front' | 'back';
}

// Global diagnostic cache for report generation
let lastDiagnosticReport: ExportDiagnosticReport | null = null;

export function getLastDiagnosticReport(): ExportDiagnosticReport | null {
  return lastDiagnosticReport;
}

/**
 * Captures card using offscreen staging with strict DOM target positioning
 * and returns validated PNG data URL.
 */
async function captureCardToPngDataUrl(options: RenderExportOptions): Promise<{
  dataUrl: string;
  report: ExportDiagnosticReport;
}> {
  // --- TEST A: VISIBLE LIVE CARD CAPTURE DIAGNOSTIC ---
  let testAState: 'A1_WORKS' | 'A2_SOLID_COLOR' | 'A_NO_VISIBLE_NODE' = 'A_NO_VISIBLE_NODE';
  let testAUniqueColors = 0;

  const visibleLiveNode = document.querySelector(
    `[data-digital-member-card-side="${options.side}"]`
  ) as HTMLElement | null;

  if (visibleLiveNode) {
    try {
      const liveDataUrl = await htmlToImage.toPng(visibleLiveNode, {
        quality: 1.0,
        pixelRatio: 4.0,
        cacheBust: true,
      });
      const liveVal = await validatePngDataUrl(liveDataUrl);
      testAUniqueColors = liveVal.uniqueColorsCount;
      testAState = liveVal.valid ? 'A1_WORKS' : 'A2_SOLID_COLOR';
    } catch (e) {
      console.warn('[Export Diagnostic] Test A visible live capture failed:', e);
      testAState = 'A2_SOLID_COLOR';
    }
  }

  // --- TEST B: OFFSCREEN CAPTURE SETUP ---
  const [processedAvatar, processedFrontBg, processedBackBg, processedBrandLogo] = await Promise.all([
    urlToDataUrl(options.avatarDisplayUrl),
    urlToDataUrl(options.settings.frontBackgroundImage),
    urlToDataUrl(options.settings.backBackgroundImage),
    urlToDataUrl(options.settings.brandLogoImage),
  ]);

  const exportSettings: DigitalMemberIdSettings = {
    ...options.settings,
    frontBackgroundImage: processedFrontBg || options.settings.frontBackgroundImage,
    backBackgroundImage: processedBackBg || options.settings.backBackgroundImage,
    brandLogoImage: processedBrandLogo || options.settings.brandLogoImage,
  };

  // 1. Create staging container physically positioned offscreen, but with display:block, opacity:1, visibility:visible
  const container = document.createElement('div');
  container.id = 'gkn-export-staging-container';
  container.style.position = 'fixed';
  container.style.top = '0px';
  container.style.left = '-10000px';
  container.style.width = '428px';
  container.style.height = '270px';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.display = 'block';
  container.style.visibility = 'visible';
  container.style.opacity = '1';
  container.style.overflow = 'hidden';

  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    // 2. Render target wrapper with position: relative, top: 0, left: 0 so SVG foreignObject captures at (0,0)
    if (options.side === 'front') {
      root.render(
        <div
          id="gkn-export-card-target"
          data-digital-member-card-side="front"
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            width: '428px',
            height: '270px',
            backgroundColor: '#060912',
            overflow: 'hidden',
          }}
          className="text-sm"
        >
          <DigitalMemberCardFront
            profile={options.profile}
            settings={exportSettings}
            avatarDisplayUrl={processedAvatar}
            tierConfig={options.tierConfig}
          />
        </div>
      );
    } else {
      root.render(
        <div
          id="gkn-export-card-target"
          data-digital-member-card-side="back"
          style={{
            position: 'relative',
            top: '0px',
            left: '0px',
            width: '428px',
            height: '270px',
            backgroundColor: '#060912',
            overflow: 'hidden',
          }}
          className="text-sm"
        >
          <DigitalMemberCardBack
            profile={options.profile}
            settings={exportSettings}
          />
        </div>
      );
    }

    // 3. Wait for React render commit
    await new Promise((resolve) => setTimeout(resolve, 250));

    // 4. Locate target node
    const captureNode = container.querySelector('#gkn-export-card-target') as HTMLElement | null;

    if (!captureNode) {
      throw new Error('Export target element #gkn-export-card-target not found in DOM.');
    }

    const sideMarker = captureNode.getAttribute('data-digital-member-card-side');
    if (sideMarker !== options.side) {
      throw new Error(`Export marker mismatch: expected ${options.side}, found ${sideMarker}`);
    }

    // 5. Gather DOM & CSS diagnostics
    const computedStaging = window.getComputedStyle(container);
    const computedCapture = window.getComputedStyle(captureNode);
    const rect = captureNode.getBoundingClientRect();

    const stagingComputedStyles = {
      display: computedStaging.display,
      visibility: computedStaging.visibility,
      opacity: computedStaging.opacity,
      position: computedStaging.position,
      width: computedStaging.width,
      height: computedStaging.height,
    };

    const captureNodeDiagnostics = {
      tagName: captureNode.tagName,
      className: captureNode.className,
      childElementCount: captureNode.childElementCount,
      descendantCount: captureNode.querySelectorAll('*').length,
      imageCount: captureNode.querySelectorAll('img').length,
      svgCount: captureNode.querySelectorAll('svg').length,
      markerFound: sideMarker === options.side,
      boundingRect: { width: rect.width, height: rect.height },
    };

    // 6. Pre-decode images and await fonts
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(captureNode.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()))
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    // 7. Capture the INNER TARGET NODE (which has position:relative, top:0, left:0)
    const dataUrl = await htmlToImage.toPng(captureNode, {
      quality: 1.0,
      pixelRatio: 4.0,
      cacheBust: true,
      backgroundColor: '#060912',
    });

    // 8. In-browser pixel validation
    const valResult = await validatePngDataUrl(dataUrl);
    const testBState: 'B1_WORKS' | 'B2_SOLID_COLOR' = valResult.valid
      ? 'B1_WORKS'
      : 'B2_SOLID_COLOR';
    const testBUniqueColors = valResult.uniqueColorsCount;

    let rootCauseClass:
      | 'FIXED_AND_WORKING'
      | 'CASE_1_OFFSCREEN_STAGING_ISSUE'
      | 'CASE_2_HTML_TO_IMAGE_ENGINE_FAILURE' = 'FIXED_AND_WORKING';

    if (testBState === 'B1_WORKS') {
      rootCauseClass = 'FIXED_AND_WORKING';
    } else if (testAState === 'A1_WORKS' && testBState === 'B2_SOLID_COLOR') {
      rootCauseClass = 'CASE_1_OFFSCREEN_STAGING_ISSUE';
    } else if (testAState === 'A2_SOLID_COLOR' && testBState === 'B2_SOLID_COLOR') {
      rootCauseClass = 'CASE_2_HTML_TO_IMAGE_ENGINE_FAILURE';
    }

    const report: ExportDiagnosticReport = {
      testAVisibleCardState: testAState,
      testAUniqueColors,
      testBOffscreenCardState: testBState,
      testBUniqueColors,
      rootCauseClass,
      stagingComputedStyles,
      captureNodeDiagnostics,
    };

    lastDiagnosticReport = report;

    // Reject download if output is solid color / blank
    if (!valResult.valid) {
      throw new Error('Unable to generate Digital Member ID. Export renderer returned a blank image.');
    }

    return { dataUrl, report };
  } finally {
    root.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Export single card side (FRONT or BACK) to PNG file
 */
export async function exportDigitalMemberCardPng(
  options: Omit<RenderExportOptions, 'side'> & { side: 'front' | 'back' }
): Promise<ExportDiagnosticReport> {
  const { dataUrl, report } = await captureCardToPngDataUrl(options);
  const sideUpper = options.side === 'front' ? 'FRONT' : 'BACK';
  const filename = formatExportFilename(options.profile.customerCode, sideUpper, 'png');
  downloadFile(dataUrl, filename);
  return report;
}

/**
 * Export 2-Page CR80 PDF (Page 1 = FRONT, Page 2 = BACK)
 */
export async function exportDigitalMemberCardPdf(
  options: Omit<RenderExportOptions, 'side'>
): Promise<ExportDiagnosticReport> {
  // 1. Capture & Validate Front PNG
  const frontRes = await captureCardToPngDataUrl({ ...options, side: 'front' });

  // 2. Capture & Validate Back PNG
  const backRes = await captureCardToPngDataUrl({ ...options, side: 'back' });

  // 3. Initialize jsPDF with exact landscape CR80 dimensions (85.60 mm × 53.98 mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [85.60, 53.98],
  });

  // Page 1: Front
  doc.addImage(frontRes.dataUrl, 'PNG', 0, 0, 85.60, 53.98);

  // Page 2: Back
  doc.addPage([85.60, 53.98], 'landscape');
  doc.addImage(backRes.dataUrl, 'PNG', 0, 0, 85.60, 53.98);

  // 4. Download PDF
  const filename = formatExportFilename(options.profile.customerCode, 'MEMBER-ID', 'pdf');
  doc.save(filename);

  return frontRes.report;
}
