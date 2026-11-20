import type { ReactNode } from 'react';
import type { DataTableColumn } from './DataTable';

interface DataTableMobileListProps<T> {
  rows: T[];
  rowKey: (row: T, index: number) => string;
  primary: DataTableColumn<T>;
  meta: DataTableColumn<T>[];
  actionColumn?: DataTableColumn<T>;
  actions?: (row: T) => ReactNode;
  cellValue: (row: T, column: DataTableColumn<T>) => ReactNode;
}

export function DataTableMobileList<T>({
  rows,
  rowKey,
  primary,
  meta,
  actionColumn,
  actions,
  cellValue,
}: DataTableMobileListProps<T>) {
  return (
    <ul className="grid gap-3 sm:hidden">
      {rows.map((row, index) => (
        <li
          key={rowKey(row, index)}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs anim-enter"
        >
          <div className="text-sm font-semibold text-[#1D3557] break-words">
            {cellValue(row, primary)}
          </div>
          {meta.length > 0 ? (
            <dl className="mt-3 grid gap-2 border-t border-gray-100 pt-2.5">
              {meta.map((c) => (
                <div
                  key={c.key}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <dt className="shrink-0 font-medium text-slate-400">
                    {c.mobileLabel ?? c.header}
                  </dt>
                  <dd className="min-w-0 text-right font-medium text-[#1D3557] break-words">
                    {cellValue(row, c)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {actionColumn ? (
            <div className="mt-3.5 border-t border-gray-100 pt-2.5">
              {actionColumn.render?.(row)}
            </div>
          ) : null}
          {actions ? (
            <div className="mt-3.5 border-t border-gray-100 pt-2.5 flex items-center gap-2">
              {actions(row)}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
