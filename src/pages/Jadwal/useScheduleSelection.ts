import { useState } from 'react';
import { HARI } from '../../lib/format';
import { slotKey } from '../../components/jadwal/session-templates';
import type { SessionTemplate } from '../../components/jadwal/session-templates';

export function useScheduleSelection(existing: Set<string>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
    const editable = HARI.map((day) =>
      slotKey(template.name, day),
    ).filter((key) => !existing.has(key));
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

  function clearSelected() {
    setSelected(new Set());
  }

  return {
    selected,
    toggleSlot,
    toggleRow,
    clearSelected,
  };
}
