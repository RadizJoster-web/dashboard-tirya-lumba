import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  primary?: boolean;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  asActions?: boolean;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  actions?: (row: T) => ReactNode;
  actionsWidth?: string;
  emptyText?: string;
  loading?: boolean;
}

function cellValue<T>(row: T, column: DataTableColumn<T>): ReactNode {
  if (column.render) return column.render(row);
  const raw = (row as Record<string, unknown>)[column.key];
  return raw === null || raw === undefined || raw === '' ? '-' : String(raw);
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  actions,
  actionsWidth = '18%',
  emptyText = 'Belum ada data yang cocok.',
  loading = false,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white anim-fade">
        <div className="p-8 space-y-4">
          <div className="h-4 bg-slate-100 rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-slate-50 rounded animate-pulse" />
          <div className="h-10 bg-slate-50 rounded animate-pulse" />
          <div className="h-10 bg-slate-50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-12 px-6 text-center anim-scale">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Inbox size={24} strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-slate-500">{emptyText}</p>
      </div>
    );
  }

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const meta = columns.filter((c) => c !== primary && !c.hideOnMobile && !c.asActions);
  const actionColumn = columns.find((c) => c.asActions);

  function getAlignClass(align?: 'left' | 'center' | 'right') {
    if (align === 'right') return 'text-right';
    if (align === 'center') return 'text-center';
    return 'text-left';
  }

  return (
    <>
      {/* Desktop / Tablet Table View */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xs sm:block anim-enter">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              {columns.map((c) => (
                <col key={c.key} style={{ width: c.width }} />
              ))}
              {actions ? <col style={{ width: actionsWidth }} /> : null}
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/70">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className={`py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 ${getAlignClass(
                      c.align,
                    )}`}
                  >
                    {c.header}
                  </th>
                ))}
                {actions ? (
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-left"
                  >
                    Aksi
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className="transition-colors hover:bg-slate-50/60 anim-fade"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`py-3.5 px-4 align-middle text-sm font-medium tabular-nums text-[#1D3557] break-words ${getAlignClass(
                        c.align,
                      )}`}
                    >
                      {cellValue(row, c)}
                    </td>
                  ))}
                  {actions ? (
                    <td className="py-3.5 px-4 align-middle text-sm text-left">
                      <div className="flex items-center gap-1.5">{actions(row)}</div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
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
    </>
  );
}
