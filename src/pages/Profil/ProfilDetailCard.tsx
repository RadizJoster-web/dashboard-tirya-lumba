import { Card } from '../../components/ui';

interface ProfilDetailCardProps {
  displayName: string;
  displayEmail: string;
  displayLokasi: string;
  role: string;
}

export default function ProfilDetailCard({
  displayName,
  displayEmail,
  displayLokasi,
  role,
}: ProfilDetailCardProps) {
  return (
    <Card
      title="Informasi Rincian Akun"
      subtitle="Data kredensial dan hak akses akun Anda"
    >
      <dl className="divide-y divide-gray-100 text-xs">
        <div className="flex flex-col gap-1 py-3.5 first:pt-0 sm:flex-row sm:items-center">
          <dt className="text-slate-400 font-semibold uppercase sm:w-44 sm:shrink-0">
            Nama Lengkap
          </dt>
          <dd className="m-0 font-bold text-[#1D3557]">{displayName}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center">
          <dt className="text-slate-400 font-semibold uppercase sm:w-44 sm:shrink-0">
            Email Akun
          </dt>
          <dd className="m-0 font-bold text-[#1D3557] break-all">{displayEmail}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center">
          <dt className="text-slate-400 font-semibold uppercase sm:w-44 sm:shrink-0">
            Hak Akses Sistem
          </dt>
          <dd className="m-0 font-bold text-[#0077B6]">
            {role === 'admin' ? 'Super Admin (Pusat)' : 'Pengelola Kolam Cabang'}
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-3.5 last:pb-0 sm:flex-row sm:items-center">
          <dt className="text-slate-400 font-semibold uppercase sm:w-44 sm:shrink-0">
            Wilayah / Lokasi Kolam
          </dt>
          <dd className="m-0 font-bold text-[#1D3557]">{displayLokasi}</dd>
        </div>
      </dl>
    </Card>
  );
}
