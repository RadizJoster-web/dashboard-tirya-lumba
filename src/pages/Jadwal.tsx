import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SkeletonForm, SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import { Button, Field } from '../components/ui';
import { apiSend } from '../lib/api';
import { API_KEYS, fetchLocations, fetchSessionsForLocation, sessionsKey } from '../lib/api-sync';
import type { ServerSession } from '../lib/api-types';
import { useResource } from '../lib/data-cache';
import { HARI } from '../lib/format';
import { resolveResched, useResched } from '../lib/store';

interface SessionTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

const TEMPLATE_KEY = 'tl_session_templates';
const DAY_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';
const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

function plusHour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return '';
  const total = (hours * 60 + minutes + 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function slotKey(name: string, day: string): string {
  return `${name}|${day}`;
}

function isTemplate(value: unknown): value is SessionTemplate {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.name === 'string' &&
    typeof row.startTime === 'string' &&
    typeof row.endTime === 'string'
  );
}

function readTemplates(): SessionTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isTemplate) : [];
  } catch {
    return [];
  }
}

function persistTemplates(rows: SessionTemplate[]): void {
  try {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(rows));
  } catch {
    // storage unavailable; the list still lives in component state
  }
}

export default function Jadwal() {
  const resched = useResched();
  const [templates, setTemplates] = useState<SessionTemplate[]>(readTemplates);
  const [templateName, setTemplateName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [locationId, setLocationId] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [fHari, setFHari] = useState('');
  const [fSesi, setFSesi] = useState('');
  const [editTarget, setEditTarget] = useState<ServerSession | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServerSession | null>(null);
  const [saving, setSaving] = useState(false);

  const { data: locationData, loading: locationsLoading } = useResource(API_KEYS.locations, fetchLocations);
  const locations = useMemo(() => locationData ?? [], [locationData]);
  const activeLocationId = locationId || locations[0]?.id || '';

  const sessionsFetcher = useCallback(
    () => (activeLocationId ? fetchSessionsForLocation(activeLocationId) : Promise.resolve([])),
    [activeLocationId],
  );
  const {
    data: sessionData,
    error: sessionsError,
    reload,
  } = useResource(sessionsKey(activeLocationId), sessionsFetcher);
  const sessions = useMemo(() => sessionData ?? [], [sessionData]);

  const existing = useMemo(
    () => new Set(sessions.map((s) => slotKey(s.sessionName, s.dayOfWeek))),
    [sessions],
  );
  const dayOptions = useMemo(() => HARI.filter((day) => sessions.some((s) => s.dayOfWeek === day)), [sessions]);
  const sessionOptions = useMemo(
    () => [...new Set(sessions.map((s) => s.sessionName))].sort((a, b) => a.localeCompare(b, 'id')),
    [sessions],
  );
  const available = useMemo(
    () => sessions.filter((s) => (!fHari || s.dayOfWeek === fHari) && (!fSesi || s.sessionName === fSesi)),
    [sessions, fHari, fSesi],
  );

  const locationName = locations.find((l) => l.id === activeLocationId)?.name ?? '';
  const nextEnd = plusHour(startTime);

  function changeLocation(id: string) {
    setLocationId(id);
    setSelected(new Set());
    setFHari('');
    setFSesi('');
  }

  function addTemplate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = templateName.trim();
    if (!name) {
      toast.error('Nama sesi wajib diisi.', { style: { color: '#B3341F' } });
      return;
    }
    if (!startTime) {
      toast.error('Jam mulai wajib diisi.', { style: { color: '#B3341F' } });
      return;
    }
    if (templates.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Nama sesi sudah dipakai.', { style: { color: '#B3341F' } });
      return;
    }
    const next = [
      ...templates,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        startTime,
        endTime: plusHour(startTime),
      },
    ];
    setTemplates(next);
    persistTemplates(next);
    setTemplateName('');
    toast.success(`Sesi "${name}" ditambahkan.`);
  }

  function removeTemplate(id: string) {
    const target = templates.find((t) => t.id === id);
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    persistTemplates(next);
    if (target) toast.success(`Sesi "${target.name}" dihapus dari daftar.`);
  }

  function toggleSlot(key: string) {
    if (existing.has(key)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function submitSchedule() {
    if (!activeLocationId) {
      toast.error('Pilih lokasi kolam terlebih dahulu.', { style: { color: '#B3341F' } });
      return;
    }
    const additions = templates.flatMap((template) =>
      HARI.filter((day) => selected.has(slotKey(template.name, day))).map((day) => ({
        sessionName: template.name,
        dayOfWeek: day,
        startTime: template.startTime,
        endTime: template.endTime,
        locationId: activeLocationId,
      })),
    );
    if (additions.length === 0) {
      toast.error('Centang minimal satu sesi pada hari yang dipilih.', { style: { color: '#B3341F' } });
      return;
    }

    setSaving(true);
    const results = await Promise.allSettled(
      additions.map((payload) => apiSend<ServerSession>('/sessions', 'POST', payload)),
    );
    await reload();
    setSelected(new Set());
    setSaving(false);

    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed === 0) {
      toast.success(`${additions.length} jadwal dikirim ke server.`);
      return;
    }
    toast.error(`${additions.length - failed} jadwal tersimpan, ${failed} gagal.`, { style: { color: '#B3341F' } });
  }

  async function saveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editTarget) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      sessionName: String(fd.get('sessionName') ?? '').trim(),
      dayOfWeek: String(fd.get('dayOfWeek') ?? ''),
      startTime: String(fd.get('startTime') ?? ''),
      endTime: String(fd.get('endTime') ?? ''),
      locationId: editTarget.locationId,
    };
    if (!payload.sessionName || !payload.dayOfWeek || !payload.startTime || !payload.endTime) {
      toast.error('Lengkapi nama, hari, dan jam sesi.', { style: { color: '#B3341F' } });
      return;
    }
    setSaving(true);
    try {
      await apiSend<ServerSession>(`/sessions/${editTarget.id}`, 'PUT', payload);
      toast.success('Sesi diperbarui.');
      setEditTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui sesi.', { style: { color: '#B3341F' } });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSession() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await apiSend(`/sessions/${deleteTarget.id}`, 'DELETE');
      toast.success('Sesi dihapus.');
      setDeleteTarget(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus sesi.', { style: { color: '#B3341F' } });
    } finally {
      setSaving(false);
    }
  }

  function decideReschedule(id: number, approved: boolean) {
    resolveResched(id, approved);
    toast.success(approved ? 'Perubahan jadwal disetujui.' : 'Permintaan perubahan ditolak.');
  }

  if (locationsLoading || (activeLocationId && !sessionData && !sessionsError)) {
    return (
      <SkeletonPage label="Memuat jadwal dan sesi">
        <SkeletonHeader />
        <SkeletonForm fields={3} />
        <div className="mt-3.5">
          <SkeletonTable rows={4} cols={4} />
        </div>
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Jadwal dan Sesi</h2>
        <p className="text-slate-500">Susun sesi lalu petakan ke hari dalam satu langkah</p>
      </div>

      {sessionsError ? (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FFE4DF] bg-[#FFF6F4] p-3 text-sm text-[#B3341F]">
          <span>Gagal memuat jadwal: {sessionsError}</span>
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => void reload()}>
            Coba lagi
          </Button>
        </div>
      ) : null}

      <div className="grid items-start gap-3.5 min-[1100px]:grid-cols-[1fr_320px]">
        <div className="grid gap-3.5">
          <section className="rounded-lg border border-gray-200 bg-white">
            <div className="p-4">
              <h3 className="m-0 text-lg font-bold">Sesi</h3>
              <p className="mt-1 mb-0 text-sm text-slate-500">Buat nama sesi dan jam mulai. Jam selesai otomatis +1 jam.</p>
              <form onSubmit={addTemplate} className="mt-3 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_140px_140px_auto]">
                <label className="block font-semibold">
                  Nama sesi
                  <input
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Contoh: Sesi 1"
                    required
                    className={inputClass}
                  />
                </label>
                <label className="block font-semibold">
                  Jam mulai
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClass} />
                </label>
                <div>
                  <span className="block font-semibold">Jam selesai</span>
                  <span className="mt-1 flex min-h-[42px] items-center rounded-lg bg-basedash px-3 py-2 font-medium text-slate-600">
                    {nextEnd || '-'}
                  </span>
                </div>
                <Button type="submit">Tambah sesi</Button>
              </form>
            </div>
            {templates.length === 0 ? (
              <p className="m-0 border-t border-gray-200 px-4 py-5 text-sm text-slate-500">
                Belum ada sesi. Tambahkan sesi pertama di atas.
              </p>
            ) : (
              <ul className="m-0 list-none divide-y divide-gray-200 border-t border-gray-200 p-0">
                {templates.map((template) => (
                  <li key={template.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                    <span>
                      <b>{template.name}</b>
                      <span className="ml-2 text-sm text-slate-500">{template.startTime} - {template.endTime}</span>
                    </span>
                    <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => removeTemplate(template.id)}>
                      Hapus
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="m-0 text-lg font-bold">Jadwal mingguan</h3>
                <p className="mt-1 mb-0 text-sm text-slate-500">Centang hari untuk setiap sesi yang akan dikirim.</p>
              </div>
              <label className="block min-w-[220px] font-semibold">
                Lokasi
                <select value={activeLocationId} onChange={(e) => changeLocation(e.target.value)} className={inputClass}>
                  <option value="">Pilih lokasi</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </label>
            </div>

            {locations.length === 0 ? (
              <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
                Belum ada lokasi terdaftar. Tambahkan lokasi terlebih dahulu.
              </p>
            ) : templates.length === 0 ? (
              <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
                Tambahkan sesi di atas untuk mulai menyusun jadwal.
              </p>
            ) : (
              <>
                <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-200 bg-basedash px-3 py-2.5 text-left font-semibold text-slate-500">Sesi</th>
                        {HARI.map((day, index) => (
                          <th key={day} title={day} className="border-b border-gray-200 bg-basedash px-3 py-2.5 text-center font-semibold text-slate-500">
                            {DAY_SHORT[index]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map((template) => (
                        <tr key={template.id} className="border-b border-gray-200 last:border-0">
                          <td className="px-3 py-2.5">
                            <b className="block">{template.name}</b>
                            <span className="text-xs text-slate-500">{template.startTime} - {template.endTime}</span>
                          </td>
                          {HARI.map((day) => {
                            const key = slotKey(template.name, day);
                            const saved = existing.has(key);
                            return (
                              <td key={day} className="px-3 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={saved || selected.has(key)}
                                  disabled={saved || saving}
                                  onChange={() => toggleSlot(key)}
                                  aria-label={`${template.name} hari ${day}`}
                                  className="h-5 w-5 accent-primary"
                                />
                                {saved ? <span className="mt-0.5 block text-[11px] text-slate-500">tersimpan</span> : null}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="m-0 text-sm text-slate-500">
                    {locationName ? `Lokasi: ${locationName}. ` : ''}Sesi bertanda tersimpan tidak bisa dicentang ulang.
                  </p>
                  <Button onClick={() => void submitSchedule()} disabled={saving}>
                    {saving ? 'Mengirim…' : 'Kirim jadwal'}
                  </Button>
                </div>
              </>
            )}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <h3 className="m-0 text-lg font-bold">Ketersediaan sesi</h3>
              <p className="mt-1 mb-0 text-sm text-slate-500">Jadwal tersimpan untuk lokasi terpilih.</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                <select value={fHari} onChange={(e) => setFHari(e.target.value)} aria-label="Filter hari" className={filterClass}>
                  <option value="">Semua hari</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select value={fSesi} onChange={(e) => setFSesi(e.target.value)} aria-label="Filter sesi" className={filterClass}>
                  <option value="">Semua sesi</option>
                  {sessionOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-4">
              <DataTable headers={['Hari', 'Sesi', 'Jam', 'Aksi']} isEmpty={available.length === 0} emptyText="Belum ada jadwal tersimpan untuk lokasi ini.">
                {available.map((session) => (
                  <tr key={session.id} className="border-b border-gray-200 last:border-0">
                    <td className="px-3.5 py-2.5">{session.dayOfWeek}</td>
                    <td className="px-3.5 py-2.5">{session.sessionName}</td>
                    <td className="px-3.5 py-2.5">{session.startTime} - {session.endTime}</td>
                    <td className="px-3.5 py-2.5">
                      <div className="flex gap-1.5">
                        <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setEditTarget(session)}>
                          Edit
                        </Button>
                        <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => setDeleteTarget(session)}>
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            </div>
          </section>
        </div>

        <aside className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="m-0 text-lg font-bold">Perubahan jadwal</h3>
          <p className="mt-1 mb-0 text-sm text-slate-500">Laporan guru yang menunggu keputusan.</p>
          {resched.length === 0 ? (
            <p className="mt-3 mb-0 rounded-lg bg-basedash p-3 text-sm text-slate-500">
              Belum ada laporan perubahan jadwal.
            </p>
          ) : (
            <ul className="m-0 mt-3 list-none divide-y divide-gray-200 p-0">
              {resched.map((request) => (
                <li key={request.id} className="py-3">
                  <b className="block">{request.pelatih}</b>
                  <span className="text-sm text-slate-500">{request.hari} · {request.jam}</span>
                  <p className="my-1 text-sm">{request.alasan}</p>
                  <div className="mt-2 flex gap-2">
                    <Button className="px-2.5 py-1 text-[13px]" onClick={() => decideReschedule(request.id, true)}>
                      Setujui
                    </Button>
                    <Button variant="danger" className="px-2.5 py-1 text-[13px]" onClick={() => decideReschedule(request.id, false)}>
                      Tolak
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {editTarget ? (
        <Modal title="Edit sesi" onClose={() => setEditTarget(null)}>
          <form onSubmit={saveEdit} className="grid gap-1">
            <Field label="Nama sesi" name="sessionName" defaultValue={editTarget.sessionName} required />
            <label className="mb-3 block font-semibold">
              Hari
              <select name="dayOfWeek" defaultValue={editTarget.dayOfWeek} className={inputClass}>
                {HARI.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Jam mulai" name="startTime" type="time" defaultValue={editTarget.startTime} required />
              <Field label="Jam selesai" name="endTime" type="time" defaultValue={editTarget.endTime} required />
            </div>
            <div className="mt-1.5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditTarget(null)}>Batal</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
            </div>
          </form>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          title="Hapus sesi?"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
              <Button variant="danger" onClick={() => void deleteSession()} disabled={saving}>
                {saving ? 'Menghapus…' : 'Hapus'}
              </Button>
            </>
          }
        >
          <p className="mb-3.5">
            Sesi <b>{deleteTarget.sessionName}</b> hari <b>{deleteTarget.dayOfWeek}</b> ({deleteTarget.startTime} - {deleteTarget.endTime}) akan dihapus.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}
