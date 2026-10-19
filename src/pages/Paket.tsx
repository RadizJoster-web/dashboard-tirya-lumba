import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import DataTable from '../components/ui/DataTable';
import { SkeletonForm, SkeletonHeader, SkeletonPage, SkeletonTable } from '../components/ui/Skeleton';
import { Button } from '../components/ui';
import { formatRp } from '../lib/format';
import { apiSend } from '../lib/api/client';
import { API_KEYS, fetchLocations, fetchPackages } from '../lib/api/resources';
import type { ServerPackage } from '../lib/api/types';
import { useResource } from '../lib/api/cache';

const PACKAGE_TYPES = ['Reguler', 'Privat', 'Atlit', 'Beasiswa'] as const;
type PackageType = (typeof PACKAGE_TYPES)[number];
type PriceForm = Record<PackageType, string>;

const EMPTY_PRICES: PriceForm = { Reguler: '', Privat: '', Atlit: '', Beasiswa: '' };
const inputClass = 'mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium';

function priceFor(packages: ServerPackage[], locationId: string, type: PackageType): ServerPackage | undefined {
  return packages.find((p) => p.locationId === locationId && p.type.toLowerCase() === type.toLowerCase());
}

export default function Paket() {
  const { data: packageData, loading: packagesLoading, reload: reloadPackages } = useResource(API_KEYS.packages, fetchPackages);
  const { data: locationData, loading: locationsLoading } = useResource(API_KEYS.locations, fetchLocations);
  const packages = useMemo(() => packageData ?? [], [packageData]);
  const locations = useMemo(() => locationData ?? [], [locationData]);

  const [locationId, setLocationId] = useState('');
  const [draft, setDraft] = useState<PriceForm | null>(null);
  const [saving, setSaving] = useState(false);

  const activeLocationId = locationId || locations[0]?.id || '';

  const savedPrices = useMemo(() => {
    const next = { ...EMPTY_PRICES };
    if (!activeLocationId) return next;
    for (const type of PACKAGE_TYPES) {
      const found = priceFor(packages, activeLocationId, type);
      next[type] = found ? String(found.price) : '';
    }
    return next;
  }, [activeLocationId, packages]);
  const prices = draft ?? savedPrices;

  function changeLocation(id: string) {
    setLocationId(id);
    setDraft(null);
  }

  const currentPackages = useMemo(
    () => packages.filter((p) => p.locationId === activeLocationId),
    [packages, activeLocationId],
  );

  async function savePrices(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeLocationId) {
      toast.error('Pilih lokasi terlebih dahulu.', { style: { color: '#B3341F' } });
      return;
    }
    for (const type of PACKAGE_TYPES) {
      const value = prices[type].trim();
      if (!value || !Number.isFinite(Number(value)) || Number(value) < 0) {
        toast.error(`Harga ${type} wajib diisi dengan angka yang valid.`, { style: { color: '#B3341F' } });
        return;
      }
    }

    const jobs: Promise<ServerPackage>[] = [];
    for (const type of PACKAGE_TYPES) {
      const price = Number(prices[type]);
      const existing = priceFor(packages, activeLocationId, type);
      if (existing) {
        if (existing.price !== price) {
          jobs.push(apiSend<ServerPackage>(`/packages/${existing.id}`, 'PUT', { locationId: activeLocationId, type, price }));
        }
      } else {
        jobs.push(apiSend<ServerPackage>('/packages', 'POST', { locationId: activeLocationId, type, price }));
      }
    }

    if (jobs.length === 0) {
      setDraft(null);
      toast.info('Tidak ada perubahan harga.');
      return;
    }

    setSaving(true);
    const results = await Promise.allSettled(jobs);
    const failed = results.filter((r) => r.status === 'rejected');
    await reloadPackages();
    setSaving(false);

    if (failed.length === 0) {
      setDraft(null);
      toast.success('Harga paket diperbarui.');
      return;
    }
    const firstError = failed[0].status === 'rejected' ? failed[0].reason : null;
    toast.error(
      firstError instanceof Error
        ? `${failed.length} paket gagal disimpan: ${firstError.message}`
        : `${failed.length} paket gagal disimpan.`,
      { style: { color: '#B3341F' } },
    );
  }

  if (packagesLoading || locationsLoading) {
    return (
      <SkeletonPage label="Memuat data harga dan paket">
        <SkeletonHeader />
        <SkeletonForm fields={5} />
        <div className="mt-3.5">
          <SkeletonTable rows={4} cols={3} />
        </div>
      </SkeletonPage>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl leading-8 font-bold">Harga dan Paket</h2>
        <p className="text-slate-500">Atur empat kategori harga sekaligus untuk satu lokasi</p>
      </div>

      <form onSubmit={savePrices} className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="mb-4 block font-semibold">
          Lokasi kolam
          <select value={activeLocationId} onChange={(e) => changeLocation(e.target.value)} required className={inputClass}>
            <option value="">Pilih lokasi</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PACKAGE_TYPES.map((type) => (
            <label key={type} className="block font-semibold">
              {type}
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="numeric"
                value={prices[type]}
                onChange={(e) => setDraft({ ...prices, [type]: e.target.value })}
                placeholder="350000"
                required
                className={inputClass}
              />
              <span className="mt-1 block text-[13px] font-medium text-slate-500">
                {prices[type] && Number.isFinite(Number(prices[type])) ? formatRp(Number(prices[type])) : 'Harga dalam rupiah'}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <Button type="submit" disabled={saving || !activeLocationId}>
            {saving ? 'Menyimpan…' : 'Simpan harga'}
          </Button>
        </div>
      </form>

      <section className="mt-5">
        <h3 className="mb-2.5 text-lg font-bold">Paket terdaftar</h3>
        <DataTable headers={['Tipe', 'Harga']} isEmpty={currentPackages.length === 0}>
          {currentPackages.map((item) => (
            <tr key={item.id} className="border-b border-gray-200 last:border-0">
              <td className="px-3.5 py-2.5">{item.type}</td>
              <td className="px-3.5 py-2.5">{formatRp(item.price)}</td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
}
