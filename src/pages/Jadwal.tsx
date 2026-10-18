import { useState } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { Button, Field } from '../components/ui';
import { HARI, SESI_NAMES } from '../lib/format';
import { apiGet, apiSend } from '../lib/api';
import type { ServerSession } from '../lib/api-types';

type SesiModal = { kind: 'add' } | { kind: 'edit'; id: string } | { kind: 'delete'; id: string } | null;

function readSesiForm(form: HTMLFormElement): { lokasi: string; hari: string; sesi: string; jam: string } | null {
  const fd = new FormData(form);
  const lokasi = String(fd.get('lokasi') ?? '');
  const hari = String(fd.get('hari') ?? '');
  const sesi = String(fd.get('sesi') ?? '');
  const jam = String(fd.get('jam') ?? '');
  if (!lokasi || !hari || !sesi || !jam) return null;
  return { lokasi, hari, sesi, jam };
}

export default function Jadwal() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<SesiModal>(null);
  const [fHari, setFHari] = useState('');
  const [fLokasi, setFLokasi] = useState('');
  const [fSesi, setFSesi] = useState('');

  const { data: sesi = [], isLoading: sesiLoading } = useQuery({
    queryKey: ['sesi'],
    queryFn: () => apiGet<ServerSession[]>('/sessions'),
  });

  const isLoading = sesiLoading;
  const locations = [...new Set(sesi.map((s) => s.locationId ?? 'Global'))];

  const editing = modal && modal.kind === 'edit' ? sesi.find((s) => s.id === modal.id) ?? null : null;
  const deleting = modal && modal.kind === 'delete' ? sesi.find((s) => s.id === modal.id) ?? null : null;
  const available = sesi.filter(
    (s) => (!fHari || s.dayOfWeek === fHari) && (!fLokasi || (s.locationId ?? '') === fLokasi) && (!fSesi || s.sessionName === fSesi),
  );

  const addMutation = useMutation({
    mutationFn: (payload: { sessionName: string; dayOfWeek: string; startTime: string; endTime: string; locationId: string | null }) =>
      apiSend<ServerSession>('/sessions', 'POST', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesi'] });
      toast.success('Sesi ditambahkan.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menambahkan sesi.', { style: { color: '#B3341F' } }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { sessionName?: string; dayOfWeek?: string; startTime?: string; endTime?: string; locationId?: string | null } }) =>
      apiSend<ServerSession>(`/sessions/${id}`, 'PUT', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesi'] });
      toast.success('Sesi diperbarui.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal memperbarui sesi.', { style: { color: '#B3341F' } }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiSend<ServerSession>(`/sessions/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesi'] });
      toast.success('Sesi dihapus.');
    },
    onError: (err: Error) => toast.error(err.message || 'Gagal menghapus sesi.', { style: { color: '#B3341F' } }),
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = readSesiForm(e.currentTarget);
    if (!parsed) return;
    const payload = {
      sessionName: parsed.sesi,
      dayOfWeek: parsed.hari,
      startTime: parsed.jam,
      endTime: parsed.jam,
      locationId: parsed.lokasi || null,
    };
    if (modal && modal.kind === 'edit') {
      updateMutation.mutate({ id: modal.id, payload });
    } else {
      addMutation.mutate(payload);
    }
    setModal(null);
  }

  const selectClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';
  const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-7 text-center text-slate-500">Memuat jadwal…</div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl leading-8 font-bold">Jadwal dan Sesi</h2>
          <p className="text-slate-500">Kelola sesi pertemuan</p>
        </div>
        <Button onClick={() => setModal({ kind: 'add' })}>+ Tambah sesi</Button>
      </div>

      <div className="grid items-start gap-3.5 [grid-template-columns:1fr] min-[1100px]:[grid-template-columns:1fr_300px]">
        <div className="grid gap-3.5">
          <DataTable headers={['Lokasi', 'Hari', 'Sesi', 'Jam', 'Aksi']} isEmpty={sesi.length === 0}>
            {sesi.map((s) => (
              <tr key={s.id} className="border-b border-gray-200 last:border-0">
                <td className="px-3.5 py-2.5">{s.locationId ?? '-'}</td>
                <td className="px-3.5 py-2.5">{s.dayOfWeek}</td>
                <td className="px-3.5 py-2.5">{s.sessionName}</td>
                <td className="px-3.5 py-2.5">{s.startTime} - {s.endTime}</td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1.5">
                    <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'edit', id: s.id })}>
                      Edit
                    </Button>
                    <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setModal({ kind: 'delete', id: s.id })}>
                      Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-2.5 text-base">Filter ketersediaan</h3>
            <div className="mb-3.5 flex flex-wrap gap-2.5">
              <select value={fHari} onChange={(e) => setFHari(e.target.value)} aria-label="Filter hari" className={filterClass}>
                <option value="">Semua hari</option>
                {HARI.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <select value={fLokasi} onChange={(e) => setFLokasi(e.target.value)} aria-label="Filter lokasi" className={filterClass}>
                <option value="">Semua lokasi</option>
                {locations.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <select value={fSesi} onChange={(e) => setFSesi(e.target.value)} aria-label="Filter sesi" className={filterClass}>
                <option value="">Semua sesi</option>
                {SESI_NAMES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <DataTable headers={['Sesi', 'Hari', 'Jam', 'Lokasi']} isEmpty={available.length === 0}>
              {available.map((s) => (
                <tr key={s.id} className="border-b border-gray-200 last:border-0">
                  <td className="px-3.5 py-2.5">{s.sessionName}</td>
                  <td className="px-3.5 py-2.5">{s.dayOfWeek}</td>
                  <td className="px-3.5 py-2.5">{s.startTime} - {s.endTime}</td>
                  <td className="px-3.5 py-2.5">{s.locationId ?? '-'}</td>
                </tr>
              ))}
            </DataTable>
          </div>
        </div>
      </div>

      {modal && (modal.kind === 'add' || editing) ? (
        <Modal title={modal.kind === 'add' ? 'Tambah sesi' : 'Edit sesi'} onClose={() => setModal(null)}>
          <form onSubmit={onSubmit} className="grid gap-1">
            <label className="mb-3 block font-semibold">
              Lokasi ID
              <input name="lokasi" defaultValue={editing?.locationId ?? ''} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium" />
            </label>
            <label className="mb-3 block font-semibold">
              Hari
              <select name="hari" defaultValue={editing?.dayOfWeek ?? HARI[0]} className={selectClass}>
                {HARI.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </label>
            <label className="mb-3 block font-semibold">
              Sesi
              <select name="sesi" defaultValue={editing?.sessionName ?? SESI_NAMES[0]} className={selectClass}>
                {SESI_NAMES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <Field label="Jam mulai" name="jam" type="time" defaultValue={editing?.startTime ?? '09:00'} required />
            <Field label="Jam selesai" name="endTime" type="time" defaultValue={editing?.endTime ?? '10:00'} required />
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModal(null)}>Batal</Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleting ? (
        <Modal title="Hapus sesi?" onClose={() => setModal(null)} footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>Batal</Button>
            <Button variant="danger" onClick={() => { deleteMutation.mutate(deleting.id); setModal(null); toast.success('Sesi dihapus.'); }}>Hapus</Button>
          </>
        }>
          <p className="mb-3.5">Data yang dihapus tidak bisa dikembalikan.</p>
        </Modal>
      ) : null}
    </div>
  );
}
