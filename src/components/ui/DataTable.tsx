import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: string;
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
  actionsWidth = '20%',
  emptyText = 'Belum ada data yang cocok.',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">
        {emptyText}
      </div>
    );
  }

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const meta = columns.filter((c) => c !== primary && !c.hideOnMobile && !c.asActions);
  const actionColumn = columns.find((c) => c.asActions);

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white sm:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
            {actions ? <col style={{ width: actionsWidth }} /> : null}
          </colgroup>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="border-b border-gray-200 bg-basedash px-3.5 py-2.5 text-left font-semibold text-slate-500"
                >
                  {c.header}
                </th>
              ))}
              {actions ? (
                <th scope="col" className="border-b border-gray-200 bg-basedash px-3.5 py-2.5 text-left font-semibold text-slate-500">
                  Aksi
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={rowKey(row, index)} className="border-b border-gray-200 last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className="px-3.5 py-2.5 align-middle break-words">
                    {cellValue(row, c)}
                  </td>
                ))}
                {actions ? <td className="px-3.5 py-2.5 align-middle">{actions(row)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-2.5 sm:hidden">
        {rows.map((row, index) => (
          <li key={rowKey(row, index)} className="rounded-lg border border-gray-200 bg-white p-3.5">
            <div className="font-semibold break-words">{cellValue(row, primary)}</div>
            {meta.length > 0 ? (
              <dl className="mt-2 grid gap-1.5">
                {meta.map((c) => (
                  <div key={c.key} className="flex items-baseline justify-between gap-3">
                    <dt className="shrink-0 text-slate-500">{c.mobileLabel ?? c.header}</dt>
                    <dd className="m-0 min-w-0 text-right break-words">{cellValue(row, c)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {actionColumn || actions ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {actionColumn ? cellValue(row, actionColumn) : null}
                {actions ? actions(row) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
