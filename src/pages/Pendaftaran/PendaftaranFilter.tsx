export type TipeAntrean = 'Semua' | 'Murid' | 'Pelatih';

interface PendaftaranFilterProps {
  tipeAntrean: TipeAntrean;
  onChange: (tipe: TipeAntrean) => void;
}

export default function PendaftaranFilter({
  tipeAntrean,
  onChange,
}: PendaftaranFilterProps) {
  const tabs: TipeAntrean[] = ['Semua', 'Murid', 'Pelatih'];

  return (
    <div className="mb-4 inline-flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-2xs">
      {tabs.map((tab) => {
        const isActive = tipeAntrean === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#1D3557] text-white shadow-2xs'
                : 'text-slate-500 hover:text-[#1D3557]'
            }`}
          >
            {tab === 'Semua'
              ? 'Semua Pendaftar'
              : tab === 'Murid'
              ? 'Murid Baru'
              : 'Pelatih Baru'}
          </button>
        );
      })}
    </div>
  );
}
