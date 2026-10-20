import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import DataTable from './ui/DataTable';
import Modal from './ui/Modal';
import { Button, Field } from './ui';

export interface CrudOption {
  value: string;
  label: string;
}

export interface CrudField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'tel' | 'time' | 'email' | 'password' | 'url' | 'select' | 'file';
  options?: readonly (string | CrudOption)[];
  accept?: string;
  required?: boolean;
}

export interface CrudColumn {
  key: string;
  header: string;
  width?: string;
  primary?: boolean;
  render?: (value: unknown) => ReactNode;
}

export interface CrudFiles {
  [key: string]: { name: string; url: string };
}

type CrudModal = { kind: 'add' } | { kind: 'edit'; id: number } | { kind: 'delete'; id: number } | null;

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

function optionValue(option: string | CrudOption): string {
  return typeof option === 'string' ? option : option.value;
}

function optionLabel(option: string | CrudOption): string {
  return typeof option === 'string' ? option : option.label;
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

export default function CrudPage({ title, subtitle, addLabel, fields, editFields, columns, rows, actionsWidth = '20%', initialOf, onAdd, onEdit, onDelete, extraActions }: CrudPageProps) {
  const [modal, setModal] = useState<CrudModal>(null);

  const editingId = modal && modal.kind === 'edit' ? modal.id : null;
  const activeFields = editingId !== null ? (editFields ?? fields) : fields;
  const deleting = modal && modal.kind === 'delete' ? rows.find((r) => r.id === modal.id) ?? null : null;
  const initial = editingId !== null ? initialOf(editingId) : {};

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, files } = readForm(e.currentTarget, activeFields);
    if (editingId !== null) {
      onEdit(editingId, data, files);
    } else {
      onAdd(data, files);
    }
    setModal(null);
  }

  const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">{title}</h2>
          <p className="text-slate-500">{subtitle}</p>
        </div>
        <Button onClick={() => setModal({ kind: 'add' })}>{addLabel}</Button>
      </div>

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

      {modal && (modal.kind === 'add' || editingId !== null) ? (
        <Modal title={modal.kind === 'add' ? `${addLabel} ${title}` : `Edit ${title}`} onClose={() => setModal(null)}>
          <form onSubmit={onSubmit} className="grid gap-1">
            {activeFields.map((f) =>
              f.type === 'select' ? (
                <label key={f.key} className="mb-3 block font-semibold">
                  {f.label}
                  <select name={f.key} defaultValue={initial[f.key] ?? optionValue(f.options?.[0] ?? '')} required={f.required !== false} className={inputClass}>
                    {(f.options ?? []).map((o) => (
                      <option key={optionValue(o)} value={optionValue(o)}>{optionLabel(o)}</option>
                    ))}
                  </select>
                </label>
              ) : f.type === 'file' ? (
                <label key={f.key} className="mb-3 block font-semibold">
                  {f.label}
                  <input name={f.key} type="file" accept={f.accept ?? 'image/*'} className={inputClass} />
                </label>
              ) : (
                <Field
                  key={f.key}
                  label={f.label}
                  name={f.key}
                  type={f.type ?? 'text'}
                  defaultValue={initial[f.key] ?? ''}
                  required={f.required !== false}
                  pattern={f.type === 'tel' ? '[0-9+ ]{8,15}' : undefined}
                  title={f.type === 'tel' ? '8-15 digit' : undefined}
                />
              ),
            )}
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModal(null)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal
          title="Hapus data?"
          onClose={() => setModal(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(deleting.id);
                  setModal(null);
                }}
              >
                Hapus
              </Button>
            </>
          }
        >
          <p className="mb-3.5">Data yang dihapus tidak bisa dikembalikan.</p>
        </Modal>
      ) : null}
    </div>
  );
}
