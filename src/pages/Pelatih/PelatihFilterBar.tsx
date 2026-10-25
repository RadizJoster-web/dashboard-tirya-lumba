const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

interface PelatihFilterBarProps {
  q: string;
  onQChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
}

export default function PelatihFilterBar({
  q,
  onQChange,
  status,
  onStatusChange,
}: PelatihFilterBarProps) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-2.5">
      <input
        placeholder="Cari nama atau telepon pelatih"
        value={q}
        onChange={(e) => onQChange(e.target.value)}
        aria-label="Cari pelatih"
        className="min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter status pelatih"
        className={filterClass}
      >
        <option value="">Semua status</option>
        <option value="aktif">Aktif</option>
        <option value="nonaktif">Non-Aktif</option>
      </select>
    </div>
  );
}
