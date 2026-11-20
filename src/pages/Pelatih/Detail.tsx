import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Phone, Printer } from 'lucide-react';
import { apiGet, assetUrl } from '../../lib/api/client';
import { Button } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { RouteLoading } from '../../components/loading';
import { initials } from '../../lib/format';
import type { ServerInstructorDetail } from '../../lib/api/types';
import {
  PelatihQualificationsCard,
  PelatihAccountMetadataCard,
} from './PelatihDetailCards';

export default function PelatihDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<ServerInstructorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!id) return;

    setLoading(true);
    apiGet<ServerInstructorDetail>(`/instructor/management/${id}`)
      .then((data) => {
        if (active) setDetail(data);
      })
      .catch((err) => {
        if (active) {
          toast.error(
            err instanceof Error ? err.message : 'Gagal memuat detail pelatih.',
          );
          navigate('/pelatih');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  if (loading || !detail) {
    return <RouteLoading />;
  }

  const detailPhoto = assetUrl(detail.profilePictureUrl);

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div>
        <Link
          to="/pelatih"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0077B6] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar Pelatih
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {detailPhoto ? (
            <img
              src={detailPhoto}
              alt={`Foto ${detail.fullName}`}
              className="h-20 w-20 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-[#6B21A8] to-[#A855F7] text-2xl font-bold text-white shrink-0 shadow-2xs">
              {initials(detail.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-2xl font-bold text-[#1D3557] truncate">
                {detail.fullName}
              </h2>
              <StatusBadge active={detail.isActive} />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  detail.isVerified
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {detail.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {detail.email ?? '-'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                {detail.phone ?? '-'}
              </span>
              {detail.phone && (
                <a
                  href={`https://wa.me/${detail.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer size={14} className="mr-1.5" />
            Cetak Profil
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PelatihQualificationsCard detail={detail} />
        <PelatihAccountMetadataCard detail={detail} />
      </div>
    </div>
  );
}
