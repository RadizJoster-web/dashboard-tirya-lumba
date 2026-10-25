interface SiswaHeaderProps {
  admin: boolean;
  lokasi?: string;
}

export default function SiswaHeader({ admin, lokasi }: SiswaHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl leading-8 font-bold">Manajemen Siswa</h2>
      <p className="text-slate-500">{admin ? 'Seluruh cabang' : (lokasi ?? '')}</p>
    </div>
  );
}
