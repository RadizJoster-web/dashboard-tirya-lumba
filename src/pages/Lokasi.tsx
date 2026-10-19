import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { Button, Field } from '../components/ui';
import { apiSend } from '../lib/api';
import { API_KEYS, fetchAreas, fetchLocations } from '../lib/api-sync';
import type { ServerLocation } from '../lib/api-types';
import { useResource } from '../lib/data-cache';

type LocationForm = { kind: 'add' } | { kind: 'edit'; row: ServerLocation } | null;

const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

export default function Lokasi() {
  const { data, loading: locationsLoading, reload } = useResource(API_KEYS.locations, fetchLocations);
  const { data: areaData, loading: areasLoading } = useResource(API_KEYS.areas, fetchAreas);
  const rows = useMemo(() => data ?? [], [data]);
  const areas = useMemo(() => [...(areaData ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'id')), [areaData]);
  const isLoading = locationsLoading || areasLoading;

  const [form, setForm] = useState<LocationForm>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServerLocation | null>(null);
  const [saving, setSaving] = useState(false);

  const areaNames = useMemo(() => new Map(areas.map((a) => [a.id, a.name])), [areas]);

  const groups = useMemo(() => {
    const grouped = new Map<string, ServerLocation[]>();
    for (const location of rows) {
      const areaName = location.areaName || (location.areaId ? areaNames.get(location.areaId) : undefined) || 'Tanpa area';
      const items = grouped.get(areaName) ?? [];
      items.push(location);
      grouped.set(areaName, items);
    }
    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'id'))
      .map(([name, items]) => ({
        name,
        items: [...items].sort((a, b) => a.name.localeCompare(b.name, 'id')),
      }));
  }, [rows, areaNames]);

  async function saveLocation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      areaId: String(fd.get('areaId') ?? ''),
      category: String(fd.get('category') ?? '').trim(),
      mapUrl: String(fd.get('mapUrl') ?? '').trim(),
    };
    if (!payload.name || !payload.areaId || !payload.category || !payload.mapUrl) {
      toast.error('Nama, area, kategori, dan map URL wajib diisi.', { style: { color: '#B3341F' } });
      return;
    }
    setSaving(true);
    try {
      if (form.kind === 'edit') {
        await apiSend<ServerLocation>(`/locations/${form.row.id}`, 'PUT', payload);
        toast.success('Lokasi diperbarui.');
      } else {
        await apiSend<ServerLocation>('/locations', 'POST', payload);
        toast.success('Lokasi ditambahkan.');
      }
      setForm(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan lokasi.', { style: { color: '#B3341F' } });
    } finally {
      setSaving(false);
    }
  }

  async function deleteLocation() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await apiSend(`/locations/${deleteTarget.id}`, 'DELETE');
      toast.success('Lokasi dihapus.');
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus lokasi.', { style: { color: '#B3341F' } });
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data lokasi">
        <SkeletonHeader action />
        <SkeletonTable rows={6} cols={4} />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Lokasi Kolam</h2>
          <p className="text-slate-500">Data lokasi dan kategori kolam renang per area</p>
        </div>
        <Button onClick={() => setForm({ kind: 'add' })}>+ Tambah lokasi</Button>
      </div>

      {groups.length === 0 ? (
        <DataTable headers={['Nama', 'Kategori', 'Map URL', 'Aksi']} isEmpty>
          <></>
        </DataTable>
      ) : (
        <div className="grid gap-5">
          {groups.map((group) => (
            <section key={group.name}>
              <div className="mb-2.5 flex flex-wrap items-baseline gap-2">
                <h3 className="m-0 text-lg font-bold">{group.name}</h3>
                <span className="text-sm text-slate-500">{group.items.length} lokasi</span>
              </div>
              <DataTable headers={['Nama', 'Kategori', 'Map URL', 'Aksi']} isEmpty={false}>
                {group.items.map((location) => (
                  <tr key={location.id} className="border-b border-gray-200 last:border-0">
                    <td className="px-3.5 py-2.5">{location.name}</td>
                    <td className="px-3.5 py-2.5">{location.category ?? '-'}</td>
                    <td className="px-3.5 py-2.5">
                      {location.mapUrl ? (
                        <a
                          href={location.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={location.mapUrl}
                          className="block max-w-[260px] truncate text-primary underline underline-offset-2"
                        >
                          {location.mapUrl}
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex gap-1.5">
                        <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setForm({ kind: 'edit', row: location })}>
                          Edit
                        </Button>
                        <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setDeleteTarget(location)}>
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </section>
          ))}
        </div>
      )}

      {form ? (
        <Modal
          title={form.kind === 'edit' ? 'Edit lokasi' : 'Tambah lokasi'}
          onClose={() => setForm(null)}
        >
          <form onSubmit={saveLocation} className="grid gap-1">
            <Field label="Nama kolam" name="name" defaultValue={form.kind === 'edit' ? form.row.name : ''} required />
            <label className="mb-3 block font-semibold">
              Area
              <select name="areaId" defaultValue={form.kind === 'edit' ? (form.row.areaId ?? '') : ''} required className={inputClass}>
                <option value="">Pilih area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
              {areas.length === 0 ? (
                <span className="mt-1 block text-[13px] font-medium text-[#B3341F]">Belum ada data area yang bisa dipilih.</span>
              ) : null}
            </label>
            <Field label="Kategori" name="category" defaultValue={form.kind === 'edit' ? (form.row.category ?? '') : ''} placeholder="Contoh: Kerjasama Tangerang" required />
            <Field
              label="Map URL"
              name="mapUrl"
              type="url"
              defaultValue={form.kind === 'edit' ? (form.row.mapUrl ?? '') : ''}
              placeholder="https://maps.google.com/?q=..."
              required
            />
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setForm(null)}>Batal</Button>
              <Button type="submit" disabled={saving || areas.length === 0}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Hapus lokasi?"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
              <Button variant="danger" onClick={() => void deleteLocation()} disabled={saving}>
                {saving ? 'Menghapus…' : 'Hapus'}
              </Button>
            </>
          }
        >
          <p className="mb-3.5">
            <b>{deleteTarget.name}</b> akan dihapus dari daftar lokasi. Tindakan ini tidak bisa dibatalkan.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
