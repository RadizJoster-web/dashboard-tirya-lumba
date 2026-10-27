interface SiswaHeaderProps {
  admin: boolean;
  lokasi?: string;
}

export default function SiswaHeader({ admin, lokasi }: SiswaHeaderProps) {
  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">
          Data Siswa & Murid
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 font-normal">
          {admin
            ? 'Daftar seluruh murid aktif dan riwayat keanggotaan di semua cabang'
            : (lokasi ? `Daftar murid aktif di ${lokasi}` : 'Daftar murid aktif di kolam Anda')}
        </p>
      </div>
    </div>
  );
}
