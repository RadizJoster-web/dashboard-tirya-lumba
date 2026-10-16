import CrudPage from '../components/CrudPage';
import { LOCATIONS, formatRp } from '../lib/demo';
import { addPaket, deletePaket, updatePaket, usePaket } from '../lib/store';

export default function Paket() {
  const rows = usePaket();

  return (
    <CrudPage
      title="Harga dan Paket"
      subtitle="Dipakai sebagai referensi harga di form pendaftaran Landing Page"
      addLabel="+ Tambah paket"
      fields={[
        { key: 'lokasi', label: 'Lokasi', type: 'select', options: LOCATIONS },
        { key: 'reguler', label: 'Harga Reguler (Rp)', type: 'number' },
        { key: 'privat', label: 'Harga Privat (Rp)', type: 'number' },
      ]}
      columns={[
        { key: 'lokasi', header: 'Lokasi' },
        { key: 'reguler', header: 'Reguler', render: (v) => formatRp(Number(v)) },
        { key: 'privat', header: 'Privat', render: (v) => formatRp(Number(v)) },
      ]}
      rows={rows}
      initialOf={(id) => {
        const r = rows.find((x) => x.id === id);
        return { lokasi: r?.lokasi ?? LOCATIONS[0], reguler: String(r?.reguler ?? ''), privat: String(r?.privat ?? '') };
      }}
      onAdd={(d) => addPaket({ lokasi: d.lokasi, reguler: Number(d.reguler), privat: Number(d.privat) })}
      onEdit={(id, d) => updatePaket(id, { lokasi: d.lokasi, reguler: Number(d.reguler), privat: Number(d.privat) })}
      onDelete={deletePaket}
    />
  );
}
