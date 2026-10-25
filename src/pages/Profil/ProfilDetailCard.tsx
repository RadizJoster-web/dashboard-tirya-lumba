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
    <Card>
      <h3 className="mb-2.5 text-base">Detail akun</h3>
      <dl>
        <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
          <dt className="text-slate-500 sm:w-44 sm:shrink-0">Nama</dt>
          <dd className="m-0 break-words font-semibold">{displayName}</dd>
        </div>
        <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
          <dt className="text-slate-500 sm:w-44 sm:shrink-0">Username / email</dt>
          <dd className="m-0 break-all font-semibold">{displayEmail}</dd>
        </div>
        <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
          <dt className="text-slate-500 sm:w-44 sm:shrink-0">Peran</dt>
          <dd className="m-0 font-semibold">{role === 'admin' ? 'Admin Pusat' : 'Pengelola Kolam'}</dd>
        </div>
        <div className="flex flex-col gap-0.5 border-b border-gray-200 py-2.5 last:border-0 sm:flex-row">
          <dt className="text-slate-500 sm:w-44 sm:shrink-0">Lokasi</dt>
          <dd className="m-0 font-semibold">{displayLokasi}</dd>
        </div>
      </dl>
    </Card>
  );
}
