import { PaketLoading } from '../../components/loading';
import { Button } from '../../components/ui';
import PaketHeader from './PaketHeader';
import PaketPriceForm from './PaketPriceForm';
import PaketTable from './PaketTable';
import { usePaketData } from './usePaketData';

export default function Paket() {
  const {
    locations,
    locationsLoading,
    activeLocationId,
    changeLocation,
    packages,
    packagesLoading,
    packagesError,
    reloadPackages,
    savedPrices,
    savePrices,
    saving,
  } = usePaketData();

  if (locationsLoading || (Boolean(activeLocationId) && packagesLoading)) {
    return <PaketLoading />;
  }

  return (
    <div>
      <PaketHeader />
      {packagesError ? (
        <section className="rounded-lg border border-red-200 bg-white p-4 text-sm">
          <p className="m-0 text-[#B3341F]">
            Gagal memuat paket untuk lokasi ini: {packagesError}
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => void reloadPackages()}
          >
            Coba lagi
          </Button>
        </section>
      ) : null}
      <PaketPriceForm
        locations={locations}
        activeLocationId={activeLocationId}
        savedPrices={savedPrices}
        saving={saving}
        canSave={!packagesLoading && !packagesError}
        onLocationChange={changeLocation}
        onSubmit={savePrices}
      />
      {packagesError ? null : (
        <PaketTable currentPackages={packages} />
      )}
    </div>
  );
}
