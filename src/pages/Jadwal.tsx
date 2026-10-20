import { useCallback, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { JadwalLoading } from '../components/loading';
import { Button } from '../components/ui';
import { apiSend } from '../lib/api/client';
import { API_KEYS, fetchLocations, fetchSessionsForLocation, sessionsKey } from '../lib/api/resources';
import type { ServerSession } from '../lib/api/types';
import { useResource } from '../lib/api/cache';
import { HARI } from '../lib/format';
import { resolveResched, useResched } from '../lib/local/reschedule-requests';
import TemplateSection from '../components/jadwal/TemplateSection';
import WeeklyMatrix from '../components/jadwal/WeeklyMatrix';
import ReschedulePanel from '../components/jadwal/ReschedulePanel';
import SavedSessionsModal from '../components/jadwal/SavedSessionsModal';
import SessionDialogs from '../components/jadwal/SessionDialogs';
import { persistTemplates, plusHour, readTemplates, slotKey } from '../components/jadwal/session-templates';
import type { SessionTemplate } from '../components/jadwal/session-templates';

export default function Jadwal() {
  const resched = useResched();
  const [templates, setTemplates] = useState<SessionTemplate[]>(readTemplates);
  const [templateName, setTemplateName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [locationId, setLocationId] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [savedOpen, setSavedOpen] = useState(false);
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
  const locationName = locations.find((l) => l.id === activeLocationId)?.name ?? '';
  const nextEnd = plusHour(startTime);

  function changeLocation(id: string) {
    setLocationId(id);
    setSelected(new Set());
    setSavedOpen(false);
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

  function toggleRow(template: SessionTemplate) {
    const editable = HARI.map((day) => slotKey(template.name, day)).filter((key) => !existing.has(key));
    if (editable.length === 0) return;
    const clear = editable.every((key) => selected.has(key));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const key of editable) {
        if (clear) next.delete(key);
        else next.add(key);
      }
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
    resolveResched(id);
    toast.success(approved ? 'Perubahan jadwal disetujui.' : 'Permintaan perubahan ditolak.');
  }

  if (locationsLoading || (activeLocationId && !sessionData && !sessionsError)) {
    return <JadwalLoading />;
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
          <TemplateSection
            templates={templates}
            templateName={templateName}
            startTime={startTime}
            nextEnd={nextEnd}
            onNameChange={setTemplateName}
            onStartTimeChange={setStartTime}
            onSubmit={addTemplate}
            onRemove={removeTemplate}
          />

          <WeeklyMatrix
            locations={locations}
            activeLocationId={activeLocationId}
            locationName={locationName}
            templates={templates}
            existing={existing}
            selected={selected}
            saving={saving}
            onLocationChange={changeLocation}
            onToggle={toggleSlot}
            onToggleRow={toggleRow}
            onOpenSaved={() => setSavedOpen(true)}
            onSubmit={() => void submitSchedule()}
          />
        </div>

        <ReschedulePanel requests={resched} onDecide={decideReschedule} />
      </div>

      {savedOpen ? (
        <SavedSessionsModal
          locationName={locationName}
          sessions={sessions}
          onClose={() => setSavedOpen(false)}
          onEdit={(session) => {
            setSavedOpen(false);
            setEditTarget(session);
          }}
          onDelete={(session) => {
            setSavedOpen(false);
            setDeleteTarget(session);
          }}
        />
      ) : null}

      <SessionDialogs
        editTarget={editTarget}
        deleteTarget={deleteTarget}
        saving={saving}
        onCloseEdit={() => setEditTarget(null)}
        onCloseDelete={() => setDeleteTarget(null)}
        onSaveEdit={saveEdit}
        onDelete={() => void deleteSession()}
      />
    </div>
  );
}
