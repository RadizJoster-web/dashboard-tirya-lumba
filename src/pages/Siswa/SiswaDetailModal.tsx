import { Phone } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import { Button, RoleTag } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge';
import { assetUrl } from '../../lib/api/client';
import { initials } from '../../lib/format';
import type { ServerSiswa } from '../../lib/api/types';

interface SiswaDetailModalProps {
  detail: ServerSiswa | null;
  onClose: () => void;
}

export default function SiswaDetailModal({ detail, onClose }: SiswaDetailModalProps) {
  if (!detail) return null;

  const photo = assetUrl(detail.profilePictureUrl ?? detail.fotoUrl);

  return (
    <Modal
      title="Detail Profil Murid"
      onClose={onClose}
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Tutup
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-slate-50/80 p-4">
          {photo ? (
            <img
              src={photo}
              alt={`Foto ${detail.nama}`}
              className="h-16 w-16 rounded-xl object-cover border border-gray-200 shadow-2xs shrink-0"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-[#0077B6] to-[#00B4D8] font-display text-xl font-bold text-white shadow-2xs shrink-0">
              {initials(detail.nama)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-base text-[#1D3557] truncate">
              {detail.nama}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">{detail.lokasi}</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge active={detail.aktif} />
              {detail.telp && (
                <a
                  href={`https://wa.me/${detail.telp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <Phone size={11} />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Usia</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block">
              {detail.usia} tahun
            </span>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">No. Telepon</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block">
              {detail.telp || '-'}
            </span>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Paket Kursus</span>
            <div className="mt-1">
              <RoleTag role="student">{detail.paket}</RoleTag>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-slate-50 p-3">
            <span className="text-slate-400 font-semibold block uppercase">Masa Berlaku</span>
            <span className="font-semibold text-[#1D3557] mt-0.5 block tabular-nums">
              {detail.berlakuSd}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
