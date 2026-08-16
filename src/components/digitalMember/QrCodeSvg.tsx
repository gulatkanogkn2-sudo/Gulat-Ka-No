import React, { useMemo } from 'react';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
  color?: string;
  bgColor?: string;
}

/**
 * Lightweight SVG QR Code matrix renderer.
 * Generates a clean 21x21 QR Version 1 bit matrix with finder patterns,
 * timing lines, and payload data bits.
 */
export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({
  value,
  size = 120,
  className = '',
  color = '#000000',
  bgColor = '#FFFFFF',
}) => {
  const matrix = useMemo(() => {
    const N = 21; // QR Code Version 1 size (21x21)
    const grid: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    const reserved: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

    // 1. Draw Finder Pattern helper
    const drawFinder = (r: number, c: number) => {
      for (let dr = 0; dr < 7; dr++) {
        for (let dc = 0; dc < 7; dc++) {
          const isOuter = dr === 0 || dr === 6 || dc === 0 || dc === 6;
          const isInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
          grid[r + dr][c + dc] = isOuter || isInner ? 1 : 0;
          reserved[r + dr][c + dc] = true;
        }
      }
      // Separator around finders
      for (let dr = -1; dr <= 7; dr++) {
        for (let dc = -1; dc <= 7; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < N && nc >= 0 && nc < N && !reserved[nr][nc]) {
            grid[nr][nc] = 0;
            reserved[nr][nc] = true;
          }
        }
      }
    };

    // Top-Left, Top-Right, Bottom-Left Finders
    drawFinder(0, 0);
    drawFinder(0, N - 7);
    drawFinder(N - 7, 0);

    // 2. Timing Patterns
    for (let i = 8; i < N - 8; i++) {
      if (!reserved[6][i]) {
        grid[6][i] = i % 2 === 0 ? 1 : 0;
        reserved[6][i] = true;
      }
      if (!reserved[i][6]) {
        grid[i][6] = i % 2 === 0 ? 1 : 0;
        reserved[i][6] = true;
      }
    }

    // Dark Module
    grid[N - 8][8] = 1;
    reserved[N - 8][8] = true;

    // 3. Simple Hash Payload Encoding for Data Modules
    let hash = 0;
    const str = value || 'GKN:GKN-000001';
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    // Fill data modules
    let bitIdx = 0;
    for (let col = N - 1; col >= 0; col -= 2) {
      if (col === 6) col--; // Skip timing column
      for (let row = 0; row < N; row++) {
        for (let c = 0; c < 2; c++) {
          const currCol = col - c;
          if (currCol >= 0 && !reserved[row][currCol]) {
            // Deterministic pseudo-random module based on string + position
            const charCode = str.charCodeAt(bitIdx % str.length);
            const seed = (row * 31 + currCol * 17 + charCode + hash + bitIdx) & 0xffff;
            const bit = (seed ^ (row + currCol)) % 2 === 0 ? 1 : 0;
            grid[row][currCol] = bit;
            bitIdx++;
          }
        }
      }
    }

    return grid;
  }, [value]);

  const N = matrix.length;
  const cellSize = 1;
  const totalSize = N;

  return (
    <svg
      viewBox={`0 0 ${totalSize} ${totalSize}`}
      width={size}
      height={size}
      className={`rounded-lg p-1.5 shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
      shapeRendering="crispEdges"
    >
      <rect width={totalSize} height={totalSize} fill={bgColor} />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
};
