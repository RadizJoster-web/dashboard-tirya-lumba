import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { toast } from 'sonner';
import DataTable from './DataTable';
import Modal from './Modal';
import { Button, Field } from './ui';

export interface CrudField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'tel' | 'time' | 'select' | 'file';
  options?: readonly string[];
  accept?: string;
  required?: boolean;
}

export interface CrudColumn {
  key: string;
  header: string;
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
  columns: CrudColumn[];
  rows: Array<{ id: number } & object>;
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

export default function CrudPage({ title, subtitle, addLabel, fields, columns, rows, initialOf, onAdd, onEdit, onDelete, extraActions }: CrudPageProps) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<CrudModal>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 250);
    return () => window.clearTimeout(t);
  }, []);

  const editingId = modal && modal.kind === 'edit' ? modal.id : null;
  const deleting = modal && modal.kind === 'delete' ? rows.find((r) => r.id === modal.id) ?? null : null;
  const initial = editingId !== null ? initialOf(editingId) : {};

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data, files } = readForm(e.currentTarget, fields);
    if (editingId !== null) {
      onEdit(editingId, data, files);
      toast.success('Perubahan disimpan.');
    } else {
      onAdd(data, files);
      toast.success('Data ditambahkan.');
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

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat data…</div>
      ) : (
        <DataTable headers={[...columns.map((c) => c.header), 'Aksi']} isEmpty={rows.length === 0}>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-gray-200 last:border-0">
              {columns.map((c) => (
                <td key={c.header} className="px-3.5 py-2.5">
                  {c.render ? c.render((r as Record<string, unknown>)[c.key]) : String((r as Record<string, unknown>)[c.key] ?? '-')}
                </td>
              ))}
              <td className="px-3.5 py-2.5">
                <div className="flex gap-1.5">
                  {extraActions ? extraActions(r.id) : null}
                  <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'edit', id: r.id })}>
                    Edit
                  </Button>
                  <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'delete', id: r.id })}>
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {modal && (modal.kind === 'add' || editingId !== null) ? (
        <Modal title={modal.kind === 'add' ? `${addLabel} ${title}` : `Edit ${title}`} onClose={() => setModal(null)}>
          <form onSubmit={onSubmit} className="grid gap-1">
            {fields.map((f) =>
              f.type === 'select' ? (
                <label key={f.key} className="mb-3 block font-semibold">
                  {f.label}
                  <select name={f.key} defaultValue={initial[f.key] ?? f.options?.[0] ?? ''} required={f.required !== false} className={inputClass}>
                    {(f.options ?? []).map((o) => (
                      <option key={o} value={o}>{o}</option>
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
                  toast.success('Data dihapus.');
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
