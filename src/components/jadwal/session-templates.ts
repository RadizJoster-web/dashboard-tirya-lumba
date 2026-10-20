export interface SessionTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

const TEMPLATE_KEY = 'tl_session_templates';

export const DAY_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
export const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';
export const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

export function plusHour(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return '';
  const total = (hours * 60 + minutes + 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function slotKey(name: string, day: string): string {
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

export function readTemplates(): SessionTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isTemplate) : [];
  } catch {
    return [];
  }
}

export function persistTemplates(rows: SessionTemplate[]): void {
  try {
    localStorage.setItem(TEMPLATE_KEY, JSON.stringify(rows));
  } catch {
    // storage unavailable; the list still lives in component state
  }
}
