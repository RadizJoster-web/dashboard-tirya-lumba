import CrudPage from '../components/CrudPage';
import { addLokasi, deleteLokasi, updateLokasi, useLokasi } from '../lib/store';

export default function Lokasi() {
  const rows = useLokasi();

  return (
    <CrudPage
      title="Lokasi Kolam"
      subtitle="Data lokasi, kategori, dan koordinat"
      addLabel="+ Tambah lokasi"
      fields={[
        { key: 'nama', label: 'Nama kolam' },
        { key: 'alamat', label: 'Alamat' },
        { key: 'kategori', label: 'Kategori', type: 'select', options: ['Indoor', 'Outdoor'] },
        { key: 'koordinat', label: 'Koordinat Maps (lat, lng)' },
      ]}
      columns={[
        { key: 'nama', header: 'Nama' },
        { key: 'alamat', header: 'Alamat' },
        { key: 'kategori', header: 'Kategori' },
        { key: 'koordinat', header: 'Koordinat' },
      ]}
      rows={rows}
      initialOf={(id) => {
        const r = rows.find((x) => x.id === id);
        return { nama: r?.nama ?? '', alamat: r?.alamat ?? '', kategori: r?.kategori ?? 'Indoor', koordinat: r?.koordinat ?? '' };
      }}
      onAdd={(d) => addLokasi({ nama: d.nama, alamat: d.alamat, kategori: d.kategori, koordinat: d.koordinat })}
      onEdit={(id, d) => updateLokasi(id, { nama: d.nama, alamat: d.alamat, kategori: d.kategori, koordinat: d.koordinat })}
      onDelete={deleteLokasi}
    />
  );
}
