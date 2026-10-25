import { useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { persistTemplates, plusHour, readTemplates } from '../../components/jadwal/session-templates';
import type { SessionTemplate } from '../../components/jadwal/session-templates';

export function useTemplateState() {
  const [templates, setTemplates] = useState<SessionTemplate[]>(readTemplates);
  const [templateName, setTemplateName] = useState('');
  const [startTime, setStartTime] = useState('09:00');

  const nextEnd = plusHour(startTime);

  function addTemplate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = templateName.trim();
    if (!name) return toast.error('Nama sesi wajib diisi.', { style: { color: '#B3341F' } });
    if (!startTime) return toast.error('Jam mulai wajib diisi.', { style: { color: '#B3341F' } });
    if (templates.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      return toast.error('Nama sesi sudah dipakai.', { style: { color: '#B3341F' } });
    }
    const next = [...templates, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, startTime, endTime: plusHour(startTime) }];
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

  return {
    templates,
    templateName,
    setTemplateName,
    startTime,
    setStartTime,
    nextEnd,
    addTemplate,
    removeTemplate,
  };
}
