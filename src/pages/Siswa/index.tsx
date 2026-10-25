import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SiswaLoading } from '../../components/loading';
import { useAuth } from '../../lib/auth-context';
import { useDebouncedValue } from '../../lib/hooks/use-debounced';
import SiswaHeader from './SiswaHeader';
import SiswaFilterBar from './SiswaFilterBar';
import SiswaTable from './SiswaTable';
import { matchesAge } from './types';
import SiswaPagination from './SiswaPagination';
import { useSiswaData } from './useSiswaData';

const PAGE_SIZE = 8;

export default function Siswa() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const admin = user!.role === 'admin';
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [usia, setUsia] = useState('');
  const [page, setPage] = useState(1);

  const { siswa, isLoading, locationOptions } = useSiswaData();

  const filtered = useMemo(() => {
    // Jika pool manager, data backend sudah terfilter khusus kolamnya jika backend menyaringnya.
    // Jika user.lokasi ada, saring sesuai lokasi tersebut jika belum terfilter.
    const scoped =
      admin || !user!.lokasi
        ? siswa
        : siswa.filter((r) => r.lokasi === user!.lokasi || !r.lokasi || r.lokasi === '-');
    const query = debouncedQ.trim().toLowerCase();
    return scoped.filter(
      (r) =>
        r.nama.toLowerCase().includes(query) &&
        (!status || (status === 'aktif') === r.aktif) &&
        (!lokasi || r.lokasi === lokasi) &&
        matchesAge(r.usia, usia),
    );
  }, [siswa, debouncedQ, status, lokasi, usia, admin, user]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function resetPage() {
    setPage(1);
  }

  if (isLoading) {
    return <SiswaLoading admin={admin} />;
  }

  return (
    <div>
      <SiswaHeader admin={admin} lokasi={user!.lokasi} />
      <SiswaFilterBar
        q={q}
        onQChange={(v) => {
          setQ(v);
          resetPage();
        }}
        usia={usia}
        onUsiaChange={(v) => {
          setUsia(v);
          resetPage();
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          resetPage();
        }}
        admin={admin}
        lokasi={lokasi}
        onLokasiChange={(v) => {
          setLokasi(v);
          resetPage();
        }}
        locationOptions={locationOptions}
      />

      <SiswaTable
        rows={pageRows}
        onSelectDetail={(id) => navigate(`/siswa/${id}`)}
      />

      <SiswaPagination
        totalItems={filtered.length}
        safePage={safePage}
        totalPages={totalPages}
        onPrev={() => setPage(safePage - 1)}
        onNext={() => setPage(safePage + 1)}
      />
    </div>
  );
}
