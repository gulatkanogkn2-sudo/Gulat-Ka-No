import React, { useMemo } from 'react';
import { Sparkles, ZoomIn, Info } from 'lucide-react';

export type SyringeType = 'u100-1ml' | 'u100-0.5ml' | 'u100-0.3ml' | 'u40-1ml';

export interface SyringeVisualizationProps {
  syringeType: SyringeType;
  calculatedUnits: number;
  volumeMl: number;
  percentageFilled: number;
  className?: string;
}

export const SyringeVisualization: React.FC<SyringeVisualizationProps> = ({
  syringeType,
  calculatedUnits,
  volumeMl,
  percentageFilled,
  className = '',
}) => {
  // Track screen size for responsive zoom window range
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scale configuration based on syringe type
  const scaleConfig = useMemo(() => {
    switch (syringeType) {
      case 'u100-0.5ml':
        return {
          maxUnits: 50,
          totalVolumeMl: 0.5,
          majorStep: 5,
          minorStep: 1,
          label: 'U-100 (0.5 mL / 50 Units)',
          unitLabel: 'Units',
        };
      case 'u100-0.3ml':
        return {
          maxUnits: 30,
          totalVolumeMl: 0.3,
          majorStep: 5,
          minorStep: 1,
          label: 'U-100 (0.3 mL / 30 Units)',
          unitLabel: 'Units',
        };
      case 'u40-1ml':
        return {
          maxUnits: 40,
          totalVolumeMl: 1.0,
          majorStep: 4,
          minorStep: 1,
          label: 'U-40 (1.0 mL / 40 Units)',
          unitLabel: 'Units (U-40)',
        };
      case 'u100-1ml':
      default:
        return {
          maxUnits: 100,
          totalVolumeMl: 1.0,
          majorStep: 10,
          minorStep: 2,
          label: 'U-100 (1.0 mL / 100 Units)',
          unitLabel: 'Units',
        };
    }
  }, [syringeType]);

  const maxUnits = scaleConfig.maxUnits;
  const clampedUnits = Math.min(maxUnits, Math.max(0, calculatedUnits));
  const fillRatio = clampedUnits / maxUnits; // 0 to 1

  // SVG Geometry Constants for Vertical Syringe (Top = Needle, Bottom = Plunger)
  const barrelTopY = 60;
  const barrelBottomY = 360;
  const barrelScaleHeight = barrelBottomY - barrelTopY; // 300px

  // Plunger Gasket Y Position
  const gasketY = barrelTopY + fillRatio * barrelScaleHeight;

  // Generate tick marks for main syringe SVG
  const ticks = useMemo(() => {
    const list: { val: number; y: number; isMajor: boolean; label?: number }[] = [];

    for (let u = 0; u <= maxUnits; u += 1) {
      const isMajor = u % scaleConfig.majorStep === 0;
      const isMinor = u % scaleConfig.minorStep === 0;

      if (isMajor || isMinor) {
        const y = barrelTopY + (u / maxUnits) * barrelScaleHeight;
        list.push({
          val: u,
          y,
          isMajor,
          label: isMajor ? u : undefined,
        });
      }
    }
    return list;
  }, [maxUnits, scaleConfig.majorStep, scaleConfig.minorStep, barrelTopY, barrelScaleHeight]);

  // Zoomed Tick Assistant bounds
  // On mobile (<768px), show 8 units range centered on target to fit phone viewports cleanly.
  // On desktop (>=768px), show 20 units range.
  const zoomRange = isMobile ? Math.min(8, maxUnits) : Math.min(20, maxUnits);

  let zoomStart = Math.max(0, clampedUnits - zoomRange / 2);
  let zoomEnd = zoomStart + zoomRange;
  if (zoomEnd > maxUnits) {
    zoomEnd = maxUnits;
    zoomStart = Math.max(0, zoomEnd - zoomRange);
  }

  // Ticks in zoom window
  const zoomTicks = useMemo(() => {
    const list: { val: number; isMajor: boolean; frac: number; x: number }[] = [];
    const startInt = Math.floor(zoomStart);
    const endInt = Math.ceil(zoomEnd);

    // SVG ViewBox geometry for Zoom Assistant: 0 to 500 width
    // Margins = 40px left and right to prevent label/pointer text clipping
    const startX = 40;
    const barWidth = 420;

    for (let u = startInt; u <= endInt; u++) {
      const frac = (u - zoomStart) / (zoomEnd - zoomStart);
      if (frac >= 0 && frac <= 1) {
        const x = startX + frac * barWidth;
        list.push({
          val: u,
          isMajor: u % scaleConfig.majorStep === 0,
          frac,
          x,
        });
      }
    }
    return list;
  }, [zoomStart, zoomEnd, scaleConfig.majorStep]);

  // Target X in SVG viewBox coordinates
  const targetFrac = zoomEnd > zoomStart ? (clampedUnits - zoomStart) / (zoomEnd - zoomStart) : 0;
  const targetX = 40 + Math.min(1, Math.max(0, targetFrac)) * 420;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Container Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#070B14]/90 border border-[#00D9FF]/30 backdrop-blur-md relative overflow-hidden space-y-6 shadow-[0_0_30px_rgba(0,217,255,0.1)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00D9FF] flex-shrink-0" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Precision Syringe Scale
            </span>
          </div>
          <span className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/10 px-2 py-0.5 rounded border border-[#00D9FF]/30 font-semibold">
            {scaleConfig.label}
          </span>
        </div>

        {/* Syringe SVG Stage */}
        <div className="relative flex justify-center items-center py-2 min-h-[400px] sm:min-h-[420px]">
          <svg
            viewBox="0 0 320 460"
            className="w-full max-w-[260px] sm:max-w-[320px] h-auto drop-shadow-[0_0_20px_rgba(0,217,255,0.2)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* GKN Laboratory Liquid Animated Gradient (Cyan to Magenta) */}
              <linearGradient id="gknLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.9">
                  <animate
                    attributeName="stop-color"
                    values="#00D9FF; #FF2ED1; #00D9FF"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#FF2ED1" stopOpacity="0.95">
                  <animate
                    attributeName="stop-color"
                    values="#FF2ED1; #00D9FF; #FF2ED1"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Metallic Needle Gradient */}
              <linearGradient id="metallicNeedle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>

              {/* Metallic Plunger Shaft Gradient */}
              <linearGradient id="metallicShaft" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="40%" stopColor="#94A3B8" />
                <stop offset="70%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Glass Barrel Reflection Gradient */}
              <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
                <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.05" />
                <stop offset="80%" stopColor="#00D9FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
              </linearGradient>

              {/* Plunger Black/Cyan Rubber Gasket */}
              <linearGradient id="gasketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="50%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Glowing Filter */}
              <filter id="neonCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. NEEDLE (TOP) */}
            <g id="needleGroup">
              <line
                x1="160"
                y1="5"
                x2="160"
                y2="38"
                stroke="url(#metallicNeedle)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="160" cy="5" r="2" fill="#00D9FF" filter="url(#neonCyanGlow)" />
              <polygon points="152,38 168,38 171,58 149,58" fill="url(#metallicShaft)" stroke="#00D9FF" strokeWidth="0.8" />
              <line x1="150" y1="46" x2="170" y2="46" stroke="#00D9FF" strokeWidth="1" opacity="0.6" />
              <line x1="151" y1="52" x2="169" y2="52" stroke="#00D9FF" strokeWidth="1" opacity="0.6" />
            </g>

            {/* 2. GLASS BARREL OUTLINE & BODY */}
            <rect
              x="120"
              y="58"
              width="80"
              height="304"
              rx="4"
              fill="#080D1A"
              stroke="#00D9FF"
              strokeWidth="1.5"
              className="drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]"
            />

            <rect x="115" y="56" width="90" height="6" rx="2" fill="url(#metallicShaft)" stroke="#00D9FF" strokeWidth="0.5" />
            <rect x="95" y="360" width="130" height="12" rx="4" fill="url(#metallicShaft)" stroke="#00D9FF" strokeWidth="1" />

            {/* 3. LAB LIQUID SOLUTION */}
            {clampedUnits > 0 && (
              <g id="liquidFill">
                <rect
                  x="122"
                  y="60"
                  width="76"
                  height={Math.max(0, gasketY - 60)}
                  fill="url(#gknLiquidGrad)"
                  rx="1"
                />
                <line x1="123" y1="62" x2="197" y2="62" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
                <circle cx="140" cy={Math.min(gasketY - 10, 80)} r="2" fill="#FFFFFF" opacity="0.4" />
                <circle cx="175" cy={Math.min(gasketY - 20, 110)} r="1.5" fill="#00D9FF" opacity="0.6" />
              </g>
            )}

            {/* 4. PLUNGER ROD & GASKET */}
            <g id="plungerGroup">
              <rect
                x="121"
                y={gasketY}
                width="78"
                height="8"
                rx="2"
                fill="url(#gasketGrad)"
                stroke="#00D9FF"
                strokeWidth="1"
              />
              <rect
                x="123"
                y={gasketY + 8}
                width="74"
                height="6"
                rx="1"
                fill="#020617"
              />

              <rect
                x="152"
                y={gasketY + 14}
                width="16"
                height={Math.max(10, 430 - (gasketY + 14))}
                fill="url(#metallicShaft)"
                stroke="#475569"
                strokeWidth="0.5"
              />

              <ellipse
                cx="160"
                cy="435"
                rx="35"
                ry="8"
                fill="url(#metallicShaft)"
                stroke="#00D9FF"
                strokeWidth="1.5"
                filter="url(#neonCyanGlow)"
              />
            </g>

            {/* 5. MEASUREMENT MARKS & NUMBERS */}
            <g id="scaleTicks">
              {ticks.map((t) => {
                const lineX1 = 120;
                const lineX2 = t.isMajor ? 138 : 129;

                return (
                  <g key={t.val}>
                    <line
                      x1={lineX1}
                      y1={t.y}
                      x2={lineX2}
                      y2={t.y}
                      stroke={t.isMajor ? '#00D9FF' : '#94A3B8'}
                      strokeWidth={t.isMajor ? 1.5 : 0.8}
                      opacity={t.isMajor ? 0.9 : 0.6}
                    />

                    {t.isMajor && (
                      <text
                        x="182"
                        y={t.y + 3.5}
                        fill="#F8FAFC"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {t.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Glass Highlights Overlay */}
            <rect
              x="120"
              y="58"
              width="80"
              height="304"
              rx="4"
              fill="url(#glassReflection)"
              pointerEvents="none"
            />

            {/* 6. TARGET MARKER CALLOUT */}
            <g id="targetCallout" filter="url(#neonCyanGlow)">
              <line
                x1="85"
                y1={gasketY}
                x2="235"
                y2={gasketY}
                stroke="#00D9FF"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              <polygon points={`85,${gasketY - 4} 93,${gasketY} 85,${gasketY + 4}`} fill="#00D9FF" />

              <rect
                x="5"
                y={gasketY - 13}
                width="76"
                height="26"
                rx="6"
                fill="#030712"
                stroke="#00D9FF"
                strokeWidth="1.5"
              />
              <text
                x="43"
                y={gasketY + 3}
                fill="#00D9FF"
                fontSize="11"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {clampedUnits.toFixed(1)} u
              </text>
            </g>
          </svg>
        </div>

        {/* Realtime Metrics Quick Badge Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 block">SYRINGE PULL</span>
            <span className="text-sm font-black text-[#00D9FF]">
              {calculatedUnits.toFixed(1)} UNITS
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 block">VOLUME</span>
            <span className="text-sm font-bold text-white">
              {volumeMl.toFixed(3)} mL
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 block">BARREL CAPACITY</span>
            <span className="text-sm font-bold text-slate-200">
              {percentageFilled.toFixed(1)}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5 text-center">
            <span className="text-[10px] text-slate-400 block">BARREL SCALE</span>
            <span className="text-sm font-bold text-[#FF2ED1]">
              {scaleConfig.maxUnits} MAX
            </span>
          </div>
        </div>

        {/* 7. ZOOMED TICK ASSISTANT - FULLY RESPONSIVE VECTOR SVG RULER */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-black/80 border border-[#00D9FF]/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px] sm:text-xs">
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00D9FF] flex-shrink-0" />
              Zoomed Tick Assistant ({Math.round(zoomStart)}–{Math.round(zoomEnd)} Units Range)
            </span>
            <span className="text-[10px] text-slate-400">Precision Tick Marker</span>
          </div>

          {/* SVG Vector Ruler Stage - Scaled 100% width with equal margins and zero overflow */}
          <div className="bg-slate-950 rounded-lg border border-white/10 p-2 sm:p-3 overflow-hidden">
            <svg
              viewBox="0 0 500 100"
              className="w-full h-auto block select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="zoomLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D9FF" />
                  <stop offset="100%" stopColor="#FF2ED1" />
                </linearGradient>

                <filter id="zoomTargetGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. RULER BASE LINE */}
              <rect x="40" y="46" width="420" height="4" rx="2" fill="#1E293B" />

              {/* 2. FILLED LIQUID PROGRESS BAR */}
              <rect
                x="40"
                y="46"
                width={Math.max(0, targetX - 40)}
                height="4"
                rx="2"
                fill="url(#zoomLiquidGrad)"
              />

              {/* 3. TARGET POINTER BADGE & CALLOUT LINE */}
              <g id="zoomPointer" filter="url(#zoomTargetGlow)">
                {/* Pointer Line */}
                <line
                  x1={targetX}
                  y1="23"
                  x2={targetX}
                  y2="48"
                  stroke="#00D9FF"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                {/* Glowing Dot at Target */}
                <circle cx={targetX} cy="48" r="4" fill="#00D9FF" />
                <circle cx={targetX} cy="48" r="2" fill="#FFFFFF" />

                {/* Target Badge */}
                <rect
                  x={targetX - 28}
                  y="3"
                  width="56"
                  height="20"
                  rx="5"
                  fill="#030712"
                  stroke="#00D9FF"
                  strokeWidth="1.5"
                />
                <text
                  x={targetX}
                  y="17"
                  fill="#00D9FF"
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {clampedUnits.toFixed(1)}u
                </text>
              </g>

              {/* 4. TICKS & LABELS */}
              <g id="zoomTickMarks">
                {zoomTicks.map((zt) => {
                  const showLabel = isMobile
                    ? true // On mobile with 8-unit range, show every integer tick label clearly spaced
                    : zt.isMajor || zt.val % 2 === 0; // On desktop with 20-unit range, show major and even ticks

                  const tickY2 = zt.isMajor ? 66 : 60;
                  const tickStroke = zt.isMajor ? '#00D9FF' : '#64748B';
                  const tickWidth = zt.isMajor ? 2 : 1.2;

                  return (
                    <g key={zt.val}>
                      {/* Tick Line */}
                      <line
                        x1={zt.x}
                        y1="48"
                        x2={zt.x}
                        y2={tickY2}
                        stroke={tickStroke}
                        strokeWidth={tickWidth}
                      />

                      {/* Tick Label */}
                      {showLabel && (
                        <text
                          x={zt.x}
                          y={zt.isMajor ? 84 : 81}
                          fill={zt.isMajor ? '#FFFFFF' : '#94A3B8'}
                          fontSize={zt.isMajor ? '11' : '9.5'}
                          fontWeight={zt.isMajor ? 'bold' : 'normal'}
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {zt.val}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          <p className="text-[11px] font-mono text-slate-400 text-center flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#00D9FF] flex-shrink-0" />
            Align top black ring of plunger gasket at tick mark{' '}
            <strong className="text-[#00D9FF]">{clampedUnits.toFixed(1)}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
