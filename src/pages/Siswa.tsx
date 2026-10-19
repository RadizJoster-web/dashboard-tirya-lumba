import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { SkeletonFilters, SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/Skeleton';
import StatusBadge from '../components/StatusBadge';
import { Button } from '../components/ui';
import { assetUrl } from '../lib/api';
import { API_KEYS, fetchLocations, fetchStudents } from '../lib/api-sync';
import { useResource } from '../lib/data-cache';
import { initials } from '../lib/format';
import { useAuth } from '../lib/auth-context';
import { useDebouncedValue } from '../lib/use-debounced';

const AGE_RANGES = [
  { value: '<10', label: 'Di bawah 10 tahun' },
  { value: '10-14', label: '10 - 14 tahun' },
  { value: '15-19', label: '15 - 19 tahun' },
  { value: '20+', label: '20 tahun ke atas' },
];

function matchesAge(age: number, range: string): boolean {
  if (!range) return true;
  if (range === '<10') return age < 10;
  if (range === '10-14') return age >= 10 && age <= 14;
  if (range === '15-19') return age >= 15 && age <= 19;
  return age >= 20;
}

const filterClass = 'w-auto min-w-[150px] rounded-lg border border-gray-300 bg-white px-3 py-2';

export default function Siswa() {
  const { user } = useAuth();
  const admin = user!.role === 'admin';
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [usia, setUsia] = useState('');
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);

  const { data, loading: isLoading } = useResource(API_KEYS.students, fetchStudents);
  const { data: locationData } = useResource(API_KEYS.locations, fetchLocations);
  const rows = useMemo(() => data ?? [], [data]);
  const locations = useMemo(() => locationData ?? [], [locationData]);

  const filtered = useMemo(() => {
    const scoped = admin || !user!.lokasi ? rows : rows.filter((r) => r.lokasi === user!.lokasi);
    const query = debouncedQ.trim().toLowerCase();
    return scoped.filter(
      (r) =>
        r.nama.toLowerCase().includes(query) &&
        (!status || (status === 'aktif') === r.aktif) &&
        (!lokasi || r.lokasi === lokasi) &&
        matchesAge(r.usia, usia),
    );
  }, [rows, debouncedQ, status, lokasi, usia, admin, user]);

  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const detail = detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;
  const photo = detail ? assetUrl(detail.profilePictureUrl ?? detail.fotoUrl) : '';

  const locationOptions = useMemo(
    () =>
      [...new Set([
        ...locations.map((l) => l.name),
        ...rows.map((r) => r.lokasi),
      ])].filter(Boolean).sort((a, b) => a.localeCompare(b, 'id')),
    [locations, rows],
  );

  const resetPage = () => setPage(1);

  if (isLoading) {
    return (
      <SkeletonPage label="Memuat data siswa">
        <SkeletonHeader />
        <SkeletonFilters fields={admin ? 4 : 3} />
        <SkeletonTable rows={8} cols={6} />
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Manajemen Siswa</h2>
        <p className="text-slate-500">{admin ? 'Seluruh cabang' : (user!.lokasi ?? '')}</p>
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <input
          placeholder="Cari nama siswa"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            resetPage();
          }}
          aria-label="Cari nama siswa"
          className="min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2"
        />
        <select
          value={usia}
          onChange={(e) => {
            setUsia(e.target.value);
            resetPage();
          }}
          aria-label="Filter usia"
          className={filterClass}
        >
          <option value="">Semua usia</option>
          {AGE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            resetPage();
          }}
          aria-label="Filter status"
          className={filterClass}
        >
          <option value="">Semua status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Non-Aktif</option>
        </select>
        {admin ? (
          <select
            value={lokasi}
            onChange={(e) => {
              setLokasi(e.target.value);
              resetPage();
            }}
            aria-label="Filter lokasi"
            className={filterClass}
          >
            <option value="">Semua lokasi</option>
            {locationOptions.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        ) : null}
      </div>

      <DataTable headers={['Nama', 'Usia', 'Lokasi', 'Berlaku s/d', 'Status', 'Aksi']} isEmpty={pageRows.length === 0}>
        {pageRows.map((r) => (
          <tr key={r.id} className="border-b border-gray-200 last:border-0">
            <td className="px-3.5 py-2.5">{r.nama}</td>
            <td className="px-3.5 py-2.5">{r.usia} thn</td>
            <td className="px-3.5 py-2.5">{r.lokasi}</td>
            <td className="px-3.5 py-2.5">{r.berlakuSd}</td>
            <td className="px-3.5 py-2.5"><StatusBadge active={r.aktif} /></td>
            <td className="px-3.5 py-2.5">
              <Button variant="ghost" className="px-2.5 py-1 text-[13px]" onClick={() => setDetailId(r.id)}>
                Detail
              </Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-slate-500">
        <span>{filtered.length} siswa</span>
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

      {detail ? (
        <Modal title="Detail siswa" onClose={() => setDetailId(null)} footer={<Button variant="ghost" onClick={() => setDetailId(null)}>Tutup</Button>}>
          <div className="mb-4 flex items-center gap-3">
            {photo ? (
              <img src={photo} alt={`Foto ${detail.nama}`} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-azure font-display text-lg font-bold text-primary">
                {initials(detail.nama)}
              </span>
            )}
            <div className="min-w-0">
              <b className="block truncate">{detail.nama}</b>
              <p className="m-0 truncate text-slate-500">{detail.lokasi}</p>
            </div>
          </div>
          <dl className="grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 sm:grid-cols-[120px_1fr]">
            <dt className="text-slate-500">Usia</dt>
            <dd className="m-0">{detail.usia} tahun</dd>
            <dt className="text-slate-500">Telepon</dt>
            <dd className="m-0">{detail.telp || '-'}</dd>
            <dt className="text-slate-500">Lokasi</dt>
            <dd className="m-0">{detail.lokasi}</dd>
            <dt className="text-slate-500">Paket</dt>
            <dd className="m-0">{detail.paket}</dd>
            <dt className="text-slate-500">Berlaku s/d</dt>
            <dd className="m-0">{detail.berlakuSd}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="m-0"><StatusBadge active={detail.aktif} /></dd>
          </dl>
        </Modal>
      ) : null}
    </div>
  );
}
