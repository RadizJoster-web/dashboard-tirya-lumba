import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import { Button, Field } from '../ui';
import type { CrudField, CrudOption } from './types';

interface CrudFormModalProps {
  isOpen: boolean;
  title: string;
  fields: CrudField[];
  initial: Record<string, string>;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

function optionValue(option: string | CrudOption): string {
  return typeof option === 'string' ? option : option.value;
}

function optionLabel(option: string | CrudOption): string {
  return typeof option === 'string' ? option : option.label;
}

const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

export default function CrudFormModal({
  isOpen,
  title,
  fields,
  initial,
  onClose,
  onSubmit,
}: CrudFormModalProps) {
  if (!isOpen) return null;

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-1">
        {fields.map((f) =>
          f.type === 'select' ? (
            <label key={f.key} className="mb-3 block font-semibold">
              {f.label}
              <select
                name={f.key}
                defaultValue={initial[f.key] ?? optionValue(f.options?.[0] ?? '')}
                required={f.required !== false}
                className={inputClass}
              >
                {(f.options ?? []).map((o) => (
                  <option key={optionValue(o)} value={optionValue(o)}>
                    {optionLabel(o)}
                  </option>
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
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Modal>
  );
}
