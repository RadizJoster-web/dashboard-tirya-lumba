import {
  SkeletonBar,
  SkeletonChart,
  SkeletonFilters,
  SkeletonForm,
  SkeletonHeader,
  SkeletonMatrix,
  SkeletonPage,
  SkeletonProfile,
  SkeletonStats,
  SkeletonTable,
} from './primitives';

export function RouteLoading() {
  return (
    <SkeletonPage label="Memuat halaman">
      <SkeletonHeader />
      <SkeletonStats />
      <SkeletonTable rows={5} cols={5} />
    </SkeletonPage>
  );
}

export function OverviewLoading() {
  return (
    <SkeletonPage label="Memuat statistik overview">
      <SkeletonHeader />
      <SkeletonStats count={3} />
      <SkeletonChart />
    </SkeletonPage>
  );
}

export function JadwalLoading() {
  return (
    <SkeletonPage label="Memuat jadwal dan sesi">
      <SkeletonHeader />
      <div className="grid items-start gap-3.5 min-[1100px]:grid-cols-[1fr_320px]">
        <div className="grid gap-3.5">
          <SkeletonForm fields={2} />
          <SkeletonMatrix rows={4} cols={8} />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <SkeletonBar className="h-4 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mt-3 rounded-lg border border-gray-200 p-3">
              <SkeletonBar className="h-3.5 w-28" />
              <SkeletonBar className="mt-2 h-3 w-40" />
              <SkeletonBar className="mt-2.5 h-3.5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}

export function LokasiLoading() {
  return (
    <SkeletonPage label="Memuat data lokasi">
      <SkeletonHeader action />
      <SkeletonTable rows={6} cols={4} />
    </SkeletonPage>
  );
}

export function PaketLoading() {
  return (
    <SkeletonPage label="Memuat data harga dan paket">
      <SkeletonHeader />
      <SkeletonForm fields={5} />
      <div className="mt-5">
        <SkeletonBar className="mb-2.5 h-5 w-36" />
        <SkeletonTable rows={4} cols={2} />
      </div>
    </SkeletonPage>
  );
}

export function PelatihLoading() {
  return (
    <SkeletonPage label="Memuat data pelatih">
      <SkeletonHeader />
      <SkeletonFilters fields={2} />
      <SkeletonTable rows={8} cols={4} />
    </SkeletonPage>
  );
}

export function PengelolaLoading() {
  return (
    <SkeletonPage label="Memuat data pengelola">
      <SkeletonHeader action />
      <SkeletonTable rows={6} cols={4} />
    </SkeletonPage>
  );
}

export function AbsensiLoading({ admin = false }: { admin?: boolean }) {
  return (
    <SkeletonPage label={admin ? 'Memuat riwayat absensi' : 'Memuat daftar hadir'}>
      <SkeletonHeader action={!admin} />
      <SkeletonFilters fields={admin ? 2 : 1} />
      <SkeletonTable rows={6} cols={admin ? 5 : 3} />
    </SkeletonPage>
  );
}

export function SiswaLoading({ admin = false }: { admin?: boolean }) {
  return (
    <SkeletonPage label="Memuat data siswa">
      <SkeletonHeader />
      <SkeletonFilters fields={admin ? 4 : 3} />
      <SkeletonTable rows={8} cols={6} />
    </SkeletonPage>
  );
}

export function ProfilLoading() {
  return (
    <SkeletonPage label="Memuat profil akun">
      <SkeletonHeader />
      <SkeletonProfile />
    </SkeletonPage>
  );
}
