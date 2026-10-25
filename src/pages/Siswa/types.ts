export const AGE_RANGES = [
  { value: '<10', label: 'Di bawah 10 tahun' },
  { value: '10-14', label: '10 - 14 tahun' },
  { value: '15-19', label: '15 - 19 tahun' },
  { value: '20+', label: '20 tahun ke atas' },
];

export function matchesAge(age: number, range: string): boolean {
  if (!range) return true;
  if (range === '<10') return age < 10;
  if (range === '10-14') return age >= 10 && age <= 14;
  if (range === '15-19') return age >= 15 && age <= 19;
  return age >= 20;
}
