import { useCallback, useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SkeletonDetail, SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { Button } from '../components/ui';
import { apiGet, assetUrl } from '../lib/api';
import { API_KEYS, fetchInstructors } from '../lib/api-sync';
import type { ServerInstructorDetail } from '../lib/api-types';
import { useResource } from '../lib/data-cache';
import { initials } from '../lib/format';
import { useDebouncedValue } from '../lib/use-debounced';

const PAGE_SIZE = 8;
const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

export default function Pelatih() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, loading: isLoading } = useResource(API_KEYS.instructors, fetchInstructors);
  const rows = useMemo(() => data ?? [], [data]);

  const detailFetcher = useCallback(
    () => (detailId ? apiGet<ServerInstructorDetail>(`/instructor/management/${detailId}`) : Promise.resolve(null)),
    [detailId],
  );
  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
    reload: reloadDetail,
  } = useResource(`instructor-detail:${detailId ?? 'none'}`, detailFetcher);

  const filtered = useMemo(() => {
    const query = debouncedQ.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!query || r.fullName.toLowerCase().includes(query) || (r.phone ?? '').includes(query)) &&
        (!status || (status === 'aktif') === r.isActive),
    );
  }, [rows, debouncedQ, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const profile = detail?.instructorProfile;
  const detailPhoto = assetUrl(detail?.profilePictureUrl);
  const locations = profile?.locations ?? [];

  function closeDetail() {
    setDetailId(null);
  }

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data pelatih">
        <SkeletonHeader />
        <SkeletonTable rows={8} cols={4} />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Manajemen Pelatih</h2>
        <p className="text-slate-500">Profil, lisensi, dan lokasi mengajar</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <input
          placeholder="Cari nama atau telepon pelatih"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          aria-label="Cari pelatih"
          className="min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter status pelatih"
          className={filterClass}
        >
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Non-Aktif</option>
        </select>
      </div>

      <DataTable headers={['Nama', 'Telepon', 'Status', 'Aksi']} isEmpty={pageRows.length === 0}>
        {pageRows.map((r) => {
          const photo = assetUrl(r.profilePictureUrl);
          return (
            <tr key={r.id} className="border-b border-gray-200 last:border-0">
              <td className="px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  {photo ? (
                    <img src={photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-azure text-xs font-bold text-primary">
                      {initials(r.fullName)}
                    </span>
                  )}
                  <span>{r.fullName}</span>
                </div>
              </td>
              <td className="px-3.5 py-2.5">{r.phone ?? '-'}</td>
              <td className="px-3.5 py-2.5"><StatusBadge active={r.isActive} /></td>
              <td className="px-3.5 py-2.5">
                <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(r.id)}>
                  Detail
                </Button>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-slate-500">
        <span>{filtered.length} pelatih</span>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage < 2} onClick={() => setPage(safePage - 1)}>
            Sebelumnya
          </Button>
          <span className="px-2 py-1">
            {safePage} / {totalPages}
          </span>
          <Button variant="ghost" className="px-2.5 py-1 text-[13px]" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
            Berikutnya
          </Button>
        </div>
      </div>

      {detailId ? (
        <Modal title="Detail pelatih" onClose={closeDetail} footer={<Button variant="ghost" onClick={closeDetail}>Tutup</Button>}>
          {detailLoading || (!detail && !detailError) ? <SkeletonDetail /> : detailError ? (
            <div className="text-sm">
              <p className="m-0 text-[#B3341F]">{detailError}</p>
              <Button variant="ghost" className="mt-3 px-2.5 py-1 text-[13px]" onClick={() => void reloadDetail()}>
                Coba lagi
              </Button>
            </div>
          ) : detail ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                {detailPhoto ? (
                  <img src={detailPhoto} alt={`Foto ${detail.fullName}`} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
                    {initials(detail.fullName)}
                  </span>
                )}
                <div className="min-w-0">
                  <b className="block truncate">{detail.fullName}</b>
                  <p className="m-0 truncate text-slate-500">{detail.email ?? '-'}</p>
                </div>
              </div>
              <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 text-sm sm:grid-cols-[120px_1fr]">
                <dt className="text-slate-500">Telepon</dt>
                <dd className="m-0">{detail.phone ?? '-'}</dd>
                <dt className="text-slate-500">Status</dt>
                <dd className="m-0"><StatusBadge active={detail.isActive} /></dd>
                <dt className="text-slate-500">Verifikasi</dt>
                <dd className="m-0">{detail.isVerified ? 'Terverifikasi' : 'Belum terverifikasi'}</dd>
                <dt className="text-slate-500">Lisensi</dt>
                <dd className="m-0">{profile?.license ?? '-'}</dd>
                <dt className="text-slate-500">Pengalaman</dt>
                <dd className="m-0">{profile?.experience ?? '-'}</dd>
                <dt className="text-slate-500">Bio</dt>
                <dd className="m-0">{profile?.shortBio ?? '-'}</dd>
                <dt className="text-slate-500">Lokasi</dt>
                <dd className="m-0">
                  {locations.length === 0
                    ? '-'
                    : locations.map((l) => `${l.name}${l.area?.name ? ` (${l.area.name})` : ''}`).join(', ')}
                </dd>
              </dl>
            </>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}
