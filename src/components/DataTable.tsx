import type { ReactNode } from 'react';

interface DataTableProps {
  headers: string[];
  children: ReactNode;
  emptyText?: string;
  isEmpty: boolean;
}

export default function DataTable({ headers, children, emptyText = 'Belum ada data yang cocok.', isEmpty }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full border-collapse whitespace-nowrap">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="border-b border-gray-200 bg-basedash px-3.5 py-2.5 text-left font-semibold text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="p-7 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
