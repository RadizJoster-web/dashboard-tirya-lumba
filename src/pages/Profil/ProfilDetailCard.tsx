import { Card } from '../../components/ui';
import { User, Mail, Shield, MapPin } from 'lucide-react';

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
  const isAdmin = role === 'admin';

  return (
    <Card
      title="Informasi Rincian Akun"
      subtitle="Data kredensial dan hak akses akun yang sedang aktif"
      className="anim-enter-2"
    >
      <div className="divide-y divide-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 py-3.5 first:pt-0">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider sm:w-48 shrink-0">
            <User size={14} className="text-slate-400" />
            <span>Nama Lengkap</span>
          </div>
          <div className="font-bold text-[#1D3557] text-sm break-words sm:text-right">
            {displayName}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 py-3.5">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider sm:w-48 shrink-0">
            <Mail size={14} className="text-slate-400" />
            <span>Email Akun</span>
          </div>
          <div className="font-medium text-[#1D3557] text-sm break-all sm:text-right">
            {displayEmail}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 py-3.5">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider sm:w-48 shrink-0">
            <Shield size={14} className="text-slate-400" />
            <span>Hak Akses Sistem</span>
          </div>
          <div className="font-bold text-[#0077B6] text-sm sm:text-right">
            {isAdmin ? 'Super Admin (Pusat PT Tirya Lumba)' : 'Pengelola Kolam Cabang'}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 py-3.5 last:pb-0">
          <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider sm:w-48 shrink-0">
            <MapPin size={14} className="text-slate-400" />
            <span>Wilayah / Kolam</span>
          </div>
          <div className="font-bold text-[#1D3557] text-sm sm:text-right">
            {displayLokasi}
          </div>
        </div>
      </div>
    </Card>
  );
}
