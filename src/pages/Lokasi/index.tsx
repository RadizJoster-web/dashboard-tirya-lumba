import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { LokasiLoading } from '../../components/loading';
import type { ServerArea, ServerLocation } from '../../lib/api/types';
import LokasiHeader from './LokasiHeader';
import LocationGroupList from './LocationGroupList';
import LocationFormModal from './LocationFormModal';
import type { LocationFormState } from './LocationFormModal';
import LocationDeleteModal from './LocationDeleteModal';
import AreaFormSection from './AreaFormSection';
import AreaEditModal from './AreaEditModal';
import AreaDeleteModal from './AreaDeleteModal';
import { useLokasiData } from './useLokasiData';

export default function Lokasi() {
  const {
    areas,
    groups,
    isLoading,
    saving,
    savingArea,
    saveArea,
    deleteArea,
    saveLocation,
    deleteLocation,
  } = useLokasiData();

  const [form, setForm] = useState<LocationFormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServerLocation | null>(null);
  const [editAreaTarget, setEditAreaTarget] = useState<ServerArea | null>(null);
  const [deleteAreaTarget, setDeleteAreaTarget] = useState<ServerArea | null>(null);

  async function handleSaveLocation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      areaId: String(fd.get('areaId') ?? ''),
      category: String(fd.get('category') ?? '').trim(),
      mapUrl: String(fd.get('mapUrl') ?? '').trim(),
    };
    if (
      !payload.name ||
      !payload.areaId ||
      !payload.category ||
      !payload.mapUrl
    ) {
      toast.error('Nama, area, kategori, dan map URL wajib diisi.', {
        style: { color: '#B3341F' },
      });
      return;
    }

    const id = form.kind === 'edit' ? form.row.id : undefined;
    const ok = await saveLocation(payload, id);
    if (ok) {
      setForm(null);
    }
  }

  async function handleDeleteLocation() {
    if (!deleteTarget) return;
    const ok = await deleteLocation(deleteTarget.id);
    if (ok) {
      setDeleteTarget(null);
    }
  }

  async function handleDeleteArea() {
    if (!deleteAreaTarget) return;
    const ok = await deleteArea(deleteAreaTarget.id);
    if (ok) {
      setDeleteAreaTarget(null);
    }
  }

  if (isLoading) {
    return <LokasiLoading />;
  }

  return (
    <div>
      {/* Form Input & Kelola Area / Kota diletakkan di atas Form / Kelola Lokasi Kolam */}
      <AreaFormSection
        areas={areas}
        savingArea={savingArea}
        onAddArea={(name) => saveArea(name)}
        onEditArea={(area) => setEditAreaTarget(area)}
        onDeleteArea={(area) => setDeleteAreaTarget(area)}
      />

      {/* Bagian Master Data Lokasi Kolam Renang */}
      <LokasiHeader onAddClick={() => setForm({ kind: 'add' })} />

      <LocationGroupList
        groups={groups}
        onEdit={(location) => setForm({ kind: 'edit', row: location })}
        onDelete={(location) => setDeleteTarget(location)}
      />

      {/* Modals untuk Lokasi */}
      <LocationFormModal
        form={form}
        areas={areas}
        saving={saving}
        onClose={() => setForm(null)}
        onSubmit={handleSaveLocation}
        onQuickAddArea={(name) => saveArea(name)}
      />

      <LocationDeleteModal
        deleteTarget={deleteTarget}
        saving={saving}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteLocation()}
      />

      {/* Modals untuk Area */}
      <AreaEditModal
        area={editAreaTarget}
        saving={savingArea}
        onClose={() => setEditAreaTarget(null)}
        onSubmit={(id, name) => saveArea(name, id)}
      />

      <AreaDeleteModal
        area={deleteAreaTarget}
        saving={savingArea}
        onClose={() => setDeleteAreaTarget(null)}
        onConfirm={() => void handleDeleteArea()}
      />
    </div>
  );
}
