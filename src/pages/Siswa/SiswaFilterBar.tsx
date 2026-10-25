import { AGE_RANGES } from './types';

const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

interface SiswaFilterBarProps {
  q: string;
  onQChange: (v: string) => void;
  usia: string;
  onUsiaChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  admin: boolean;
  lokasi: string;
  onLokasiChange: (v: string) => void;
  locationOptions: string[];
}

export default function SiswaFilterBar({
  q,
  onQChange,
  usia,
  onUsiaChange,
  status,
  onStatusChange,
  admin,
  lokasi,
  onLokasiChange,
  locationOptions,
}: SiswaFilterBarProps) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2.5">
      <input
        placeholder="Cari nama siswa"
        value={q}
        onChange={(e) => onQChange(e.target.value)}
        aria-label="Cari nama siswa"
        className="min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
      />
      <select
        value={usia}
        onChange={(e) => onUsiaChange(e.target.value)}
        aria-label="Filter usia"
        className={filterClass}
      >
        <option value="">Semua usia</option>
        {AGE_RANGES.map((r) => (
          <option key={r.value} value={r.value}>{r.label}</option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter status"
        className={filterClass}
      >
        <option value="">Semua status</option>
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Non-Aktif</option>
      </select>
      {admin ? (
        <select
          value={lokasi}
          onChange={(e) => onLokasiChange(e.target.value)}
          aria-label="Filter lokasi"
          className={filterClass}
        >
          <option value="">Semua lokasi</option>
          {locationOptions.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      ) : null}
    </div>
  );
}
