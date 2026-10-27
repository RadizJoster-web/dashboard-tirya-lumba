import { useState } from 'react';

export interface ChartBarProps {
  data: number[];
  labels: string[];
  caption: string;
  height?: number;
}

export default function ChartBar({
  data,
  labels,
  caption,
  height = 240,
}: ChartBarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const rawMax = Math.max(...data, 0);
  // Round up max for clean gridlines (e.g., if max is 7 -> 8 or 10)
  const max = rawMax === 0 ? 5 : Math.ceil(rawMax * 1.15);
  const peakIndex = data.indexOf(Math.max(...data));

  const gridSteps = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div
      role="img"
      aria-label={caption}
      className="relative flex flex-col pt-4 select-none"
    >
      {/* Background horizontal dashed gridlines */}
      <div
        className="relative w-full"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {gridSteps.map((step) => {
            const val = Math.round(max * step);
            return (
              <div
                key={step}
                className="flex items-center gap-3 w-full border-b border-dashed border-gray-200"
              >
                <span className="w-8 shrink-0 text-right font-mono text-[11px] font-medium text-slate-400 tabular-nums">
                  {val}
                </span>
                <div className="flex-1" />
              </div>
            );
          })}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 pl-11 flex items-end justify-between gap-1.5 sm:gap-3">
          {data.map((value, i) => {
            const isPeak = i === peakIndex && value > 0;
            const isHovered = hoveredIdx === i;
            const barHeightPct = max > 0 ? (value / max) * 100 : 0;
            const minHeightPx = value > 0 ? 6 : 2;

            return (
              <div
                key={labels[i] ?? i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-11 z-20 flex flex-col items-center pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="rounded-lg bg-[#1D3557] px-2.5 py-1 text-center shadow-lg">
                      <span className="block text-[11px] font-bold text-white tabular-nums">
                        {value} pendaftar
                      </span>
                    </div>
                    <div className="h-1.5 w-2 -mt-0.5 border-4 border-transparent border-t-[#1D3557]" />
                  </div>
                )}

                {/* Bar Element */}
                <div
                  className="w-full max-w-[42px] transition-all duration-300 ease-out"
                  style={{
                    height: `${Math.max(barHeightPct, 0)}%`,
                    minHeight: `${minHeightPx}px`,
                  }}
                >
                  <div
                    className={`h-full w-full rounded-t-xl transition-all duration-200 ${
                      isPeak
                        ? 'bg-[#00B4D8] hover:bg-[#0077B6] shadow-sm shadow-[#00B4D8]/30'
                        : isHovered
                        ? 'bg-[#0077B6]'
                        : 'bg-[#1D3557]/80 hover:bg-[#1D3557]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="pl-11 mt-3 flex items-center justify-between gap-1.5 sm:gap-3 border-t border-gray-100 pt-2">
        {labels.map((label, i) => {
          const isPeak = i === peakIndex && data[i] > 0;
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={label}
              className="flex-1 text-center"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span
                className={`block text-[11px] sm:text-xs font-medium truncate transition-colors ${
                  isPeak
                    ? 'font-bold text-[#0077B6]'
                    : isHovered
                    ? 'text-[#1D3557]'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
