import React, { useMemo } from 'react';

interface BarcodeSvgProps {
  value: string;
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  bgColor?: string;
  showText?: boolean;
}

/**
 * Lightweight SVG Barcode vector renderer for customer identity codes.
 * Renders vector bars with start/stop patterns and clear alphanumeric code text below.
 */
export const BarcodeSvg: React.FC<BarcodeSvgProps> = ({
  value,
  width = 220,
  height = 54,
  className = '',
  color = '#000000',
  bgColor = '#FFFFFF',
  showText = true,
}) => {
  const bars = useMemo(() => {
    const rawVal = (value || 'GKN-000001').toUpperCase().trim();
    // Deterministic bar width pattern mapping
    const patterns: number[] = [];
    
    // Start pattern (Code 128 / Code 39 equivalent)
    patterns.push(2, 1, 1, 2, 1, 1);

    for (let i = 0; i < rawVal.length; i++) {
      const code = rawVal.charCodeAt(i);
      const w1 = (code % 3) + 1;
      const w2 = ((code >> 1) % 3) + 1;
      const w3 = ((code >> 2) % 3) + 1;
      const w4 = ((code >> 3) % 2) + 1;
      patterns.push(w1, w2, w3, w4);
    }

    // Stop pattern
    patterns.push(2, 1, 2, 1, 2, 1, 2);

    return patterns;
  }, [value]);

  const totalUnits = bars.reduce((a, b) => a + b, 0);

  let currentX = 0;
  const rects: Array<{ x: number; w: number }> = [];

  bars.forEach((barWidth, idx) => {
    const isBar = idx % 2 === 0;
    if (isBar) {
      rects.push({ x: currentX, w: barWidth });
    }
    currentX += barWidth;
  });

  return (
    <div
      className={`flex flex-col items-center justify-center p-2 rounded-lg shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <svg
        viewBox={`0 0 ${totalUnits} 36`}
        width={width}
        height={height}
        preserveAspectRatio="none"
        className="w-full h-auto"
        shapeRendering="crispEdges"
      >
        <rect width={totalUnits} height={36} fill={bgColor} />
        {rects.map((r, i) => (
          <rect
            key={i}
            x={r.x}
            y={0}
            width={r.w}
            height={36}
            fill={color}
          />
        ))}
      </svg>
      {showText && (
        <span
          className="text-[10px] sm:text-xs font-mono font-bold tracking-widest mt-1 text-center"
          style={{ color }}
        >
          {value || 'GKN-000000'}
        </span>
      )}
    </div>
  );
};
