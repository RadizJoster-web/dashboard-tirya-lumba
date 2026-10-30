import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { Button, Field } from '../../components/ui';
import type { ServerArea, ServerLocation } from '../../lib/api/types';
import { QuickAddAreaSection } from './QuickAddAreaSection';

export type LocationFormState = { kind: 'add' } | { kind: 'edit'; row: ServerLocation } | null;

interface LocationFormModalProps {
  form: LocationFormState;
  areas: ServerArea[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onQuickAddArea?: (name: string) => Promise<boolean>;
}

const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

export default function LocationFormModal({
  form,
  areas,
  saving,
  onClose,
  onSubmit,
  onQuickAddArea,
}: LocationFormModalProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAreaName, setQuickAreaName] = useState('');
  const [addingArea, setAddingArea] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>(
    form?.kind === 'edit' ? (form.row.areaId ?? '') : ''
  );

  if (!form) return null;

  async function handleQuickAdd() {
    if (!quickAreaName.trim() || !onQuickAddArea) return;
    setAddingArea(true);
    const ok = await onQuickAddArea(quickAreaName.trim());
    setAddingArea(false);
    if (ok) {
      setQuickAreaName('');
      setShowQuickAdd(false);
    }
  }

  return (
    <Modal
      title={form.kind === 'edit' ? 'Edit lokasi' : 'Tambah lokasi'}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="grid gap-1">
        <Field label="Nama kolam" name="name" defaultValue={form.kind === 'edit' ? form.row.name : ''} required />

        <div className="mb-3">
          <div className="flex items-center justify-between">
            <label htmlFor="location-area-select" className="block font-semibold">
              Area
            </label>
            {onQuickAddArea ? (
              <button
                type="button"
                onClick={() => setShowQuickAdd((v) => !v)}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                {showQuickAdd ? <><X size={12} /> Batal</> : <><Plus size={12} /> Tambah area baru</>}
              </button>
            ) : null}
          </div>

          <QuickAddAreaSection
            show={showQuickAdd}
            name={quickAreaName}
            adding={addingArea}
            onChangeName={setQuickAreaName}
            onAdd={() => void handleQuickAdd()}
          />

          <select
            id="location-area-select"
            name="areaId"
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Pilih area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
          {areas.length === 0 ? (
            <span className="mt-1 block text-[13px] font-medium text-[#B3341F]">
              Belum ada data area. Masukkan area terlebih dahulu di atas atau klik '+ Tambah area baru'.
            </span>
          ) : null}
        </div>

        <Field
          label="Kategori"
          name="category"
          defaultValue={form.kind === 'edit' ? (form.row.category ?? '') : ''}
          placeholder="Contoh: Kerjasama Tangerang"
          required
        />
        <Field
          label="Map URL"
          name="mapUrl"
          type="url"
          defaultValue={form.kind === 'edit' ? (form.row.mapUrl ?? '') : ''}
          placeholder="https://maps.google.com/?q=..."
          required
        />
        <div className="mt-1.5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" disabled={saving || areas.length === 0}>
            {saving ? 'Menyimpan…' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
