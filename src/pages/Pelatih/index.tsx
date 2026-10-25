import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PelatihLoading } from '../../components/loading';
import { useDebouncedValue } from '../../lib/hooks/use-debounced';
import PelatihHeader from './PelatihHeader';
import PelatihFilterBar from './PelatihFilterBar';
import PelatihTable from './PelatihTable';
import PelatihPagination from './PelatihPagination';
import { usePelatihData } from './usePelatihData';

const PAGE_SIZE = 8;

export default function Pelatih() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const {
    instructors,
    isLoading,
  } = usePelatihData();

  const filtered = useMemo(() => {
    const query = debouncedQ.trim().toLowerCase();
    return instructors.filter(
      (r) =>
        (!query ||
          r.fullName.toLowerCase().includes(query) ||
          (r.phone ?? '').includes(query)) &&
        (!status || (status === 'aktif') === r.isActive),
    );
  }, [instructors, debouncedQ, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return <PelatihLoading />;
  }

  return (
    <div>
      <PelatihHeader />
      <PelatihFilterBar
        q={q}
        onQChange={(v) => {
          setQ(v);
          setPage(1);
        }}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
      />

      <PelatihTable
        rows={pageRows}
        onSelectDetail={(id) => navigate(`/pelatih/${id}`)}
      />

      <PelatihPagination
        totalItems={filtered.length}
        safePage={safePage}
        totalPages={totalPages}
        onPrev={() => setPage(safePage - 1)}
        onNext={() => setPage(safePage + 1)}
      />
    </div>
  );
}
