import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import DataTable from '../ui/DataTable';
import { Button } from '../ui';
import CrudHeader from './CrudHeader';
import CrudFormModal from './CrudFormModal';
import CrudDeleteModal from './CrudDeleteModal';
import type { CrudColumn, CrudField, CrudFiles, CrudModal } from './types';

export type { CrudOption, CrudField, CrudColumn, CrudFiles } from './types';

interface CrudPageProps {
  title: string;
  subtitle: string;
  addLabel: string;
  fields: CrudField[];
  editFields?: CrudField[];
  columns: CrudColumn[];
  rows: Array<{ id: number } & Record<string, unknown>>;
  actionsWidth?: string;
  initialOf: (id: number) => Record<string, string>;
  onAdd: (data: Record<string, string>, files: CrudFiles) => void;
  onEdit: (id: number, data: Record<string, string>, files: CrudFiles) => void;
  onDelete: (id: number) => void;
  extraActions?: (id: number) => ReactNode;
}

function readForm(form: HTMLFormElement, fields: CrudField[]): { data: Record<string, string>; files: CrudFiles } {
  const fd = new FormData(form);
  const data: Record<string, string> = {};
  const files: CrudFiles = {};
  for (const f of fields) {
    if (f.type === 'file') {
      const input = form.querySelector(`input[name="${f.key}"]`);
      const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined;
      if (file) files[f.key] = { name: file.name, url: URL.createObjectURL(file) };
      continue;
    }
    data[f.key] = String(fd.get(f.key) ?? '');
  }
  return { data, files };
}

export default function CrudPage({
  title,
  subtitle,
  addLabel,
  fields,
  editFields,
  columns,
  rows,
  actionsWidth = '20%',
  initialOf,
  onAdd,
  onEdit,
  onDelete,
  extraActions,
}: CrudPageProps) {
  const [modal, setModal] = useState<CrudModal>(null);

  const editingId = modal && modal.kind === 'edit' ? modal.id : null;
  const deletingId = modal && modal.kind === 'delete' ? modal.id : null;
  const activeFields = editingId !== null ? (editFields ?? fields) : fields;
  const initial = editingId !== null ? initialOf(editingId) : {};

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, files } = readForm(e.currentTarget, activeFields);
    if (editingId !== null) {
      onEdit(editingId, data, files);
    } else {
      onAdd(data, files);
    }
    setModal(null);
  }

  function handleDeleteConfirm() {
    if (deletingId !== null) {
      onDelete(deletingId);
      setModal(null);
    }
  }

  return (
    <div>
      <CrudHeader
        title={title}
        subtitle={subtitle}
        addLabel={addLabel}
        onAddClick={() => setModal({ kind: 'add' })}
      />

      <DataTable
        columns={[
          ...columns.map((c) => ({
            key: c.key,
            header: c.header,
            width: c.width,
            primary: c.primary,
            render: (row: Record<string, unknown>) =>
              c.render ? c.render(row[c.key]) : String(row[c.key] ?? '-'),
          })),
        ]}
        rows={rows}
        rowKey={(r) => String(r.id)}
        actionsWidth={actionsWidth}
        actions={(r) => (
          <div className="flex flex-wrap gap-1.5">
            {extraActions ? extraActions(r.id) : null}
            <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'edit', id: r.id })}>
              Edit
            </Button>
            <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'delete', id: r.id })}>
              Hapus
            </Button>
          </div>
        )}
        emptyText="Belum ada data yang cocok."
      />

      <CrudFormModal
        isOpen={modal !== null && (modal.kind === 'add' || editingId !== null)}
        title={modal?.kind === 'add' ? `${addLabel} ${title}` : `Edit ${title}`}
        fields={activeFields}
        initial={initial}
        onClose={() => setModal(null)}
        onSubmit={handleSubmit}
      />

      <CrudDeleteModal
        isOpen={deletingId !== null}
        onClose={() => setModal(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
