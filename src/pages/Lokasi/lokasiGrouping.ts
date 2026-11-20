import type { ServerArea, ServerLocation } from '../../lib/api/types';

export interface LocationGroup {
  name: string;
  items: ServerLocation[];
}

export function groupLocationsByArea(
  rows: ServerLocation[],
  areas: ServerArea[],
): LocationGroup[] {
  const areaNames = new Map(areas.map((a) => [a.id, a.name]));
  const grouped = new Map<string, ServerLocation[]>();

  for (const location of rows) {
    const areaName =
      location.areaName ||
      (location.areaId ? areaNames.get(location.areaId) : undefined) ||
      'Tanpa area';
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
}
