import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { apiSend } from '../../lib/api/client';
import type { ServerSession } from '../../lib/api/types';

interface UseSessionDialogsProps {
  onReload: () => Promise<void>;
}

export function useSessionDialogs({ onReload }: UseSessionDialogsProps) {
  const [savedOpen, setSavedOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ServerSession | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServerSession | null>(null);
  const [saving, setSaving] = useState(false);

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
      return toast.error('Lengkapi nama, hari, dan jam sesi.', { style: { color: '#B3341F' } });
    }
    setSaving(true);
    try {
      await apiSend<ServerSession>(`/sessions/${editTarget.id}`, 'PUT', payload);
      toast.success('Sesi diperbarui.');
      setEditTarget(null);
      await onReload();
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
      await onReload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus sesi.', { style: { color: '#B3341F' } });
    } finally {
      setSaving(false);
    }
  }

  return {
    savedOpen,
    setSavedOpen,
    editTarget,
    setEditTarget,
    deleteTarget,
    setDeleteTarget,
    saving,
    setSaving,
    saveEdit,
    deleteSession,
  };
}
