import React from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
  stickyHeader?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No records found.',
  isLoading = false,
  className = '',
  stickyHeader = false,
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-white/10 ${className}`}>
      <table className="w-full text-left text-sm text-slate-200 border-collapse">
        <thead
          className={`bg-white/5 text-xs font-bold text-[#00D9FF] uppercase tracking-wider border-b border-[#00D9FF]/30 drop-shadow-[0_0_10px_rgba(0,217,255,0.3)] ${
            stickyHeader ? 'sticky top-0 z-10 backdrop-blur-md' : ''
          }`}
        >
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-5 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-[var(--bg-panel)] backdrop-blur-xl">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className="hover:bg-[#00D9FF]/5 hover:shadow-[inset_0_0_15px_rgba(0,217,255,0.1)] transition-all duration-300 group relative cursor-pointer"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 relative z-10 ${col.className || ''}`}>
                    {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
