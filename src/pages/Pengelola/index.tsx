import { useState } from 'react';
import CrudPage from '../../components/CrudPage';
import { PengelolaLoading } from '../../components/loading';
import { Button } from '../../components/ui';
import PengelolaDetailModal from './PengelolaDetailModal';
import { usePengelolaData } from './usePengelolaData';

export default function Pengelola() {
  const [detailId, setDetailId] = useState<string | null>(null);

  const {
    rows,
    locationName,
    crudRows,
    locationOptions,
    isLoading,
    addManager,
    updateManager,
    deleteManager,
  } = usePengelolaData();

  const detail =
    detailId !== null ? rows.find((r) => r.id === detailId) ?? null : null;

  if (isLoading) {
    return <PengelolaLoading />;
  }

  return (
    <div>
      <CrudPage
        title="Pengelola Kolam"
        subtitle="Kelola akun pengelola dan kolam renang yang mereka kelola"
        addLabel="Tambah"
        fields={[
          { key: 'fullName', label: 'Nama lengkap', required: true },
          { key: 'email', label: 'Email', type: 'email', required: true },
          { key: 'password', label: 'Password', type: 'password', required: true },
          { key: 'phone', label: 'No. telepon', type: 'tel', required: true },
          {
            key: 'locationId',
            label: 'Lokasi kolam renang yang dikelola',
            type: 'select',
            options: locationOptions,
            required: true,
          },
        ]}
        editFields={[
          { key: 'fullName', label: 'Nama lengkap', required: true },
          { key: 'phone', label: 'No. telepon', type: 'tel', required: true },
          {
            key: 'locationId',
            label: 'Lokasi kolam renang yang dikelola',
            type: 'select',
            options: locationOptions,
            required: true,
          },
        ]}
        columns={[
          { key: 'nama', header: 'Nama', width: '28%', primary: true },
          { key: 'email', header: 'Email', width: '26%' },
          { key: 'telp', header: 'No. Telepon', width: '20%' },
          { key: 'lokasi', header: 'Kolam Dikelola', width: '26%' },
        ]}
        actionsWidth="18%"
        rows={crudRows}
        initialOf={(id) => {
          const r = crudRows.find((x) => x.id === id);
          return {
            fullName: r?.nama ?? '',
            phone: r?.telp ?? '',
            locationId: r?.locationId ?? '',
          };
        }}
        onAdd={(d) =>
          void addManager({
            fullName: d.fullName,
            email: d.email,
            password: d.password,
            phone: d.phone,
            locationId: d.locationId,
            isActive: true,
          })
        }
        onEdit={(id, d) => {
          const r = crudRows.find((x) => x.id === id);
          void updateManager(r?.serverId ?? '', {
            fullName: d.fullName,
            phone: d.phone,
            locationId: d.locationId,
          });
        }}
        onDelete={(id) => {
          const r = crudRows.find((x) => x.id === id);
          void deleteManager(r?.serverId ?? '');
        }}
        extraActions={(id) => {
          const row = crudRows.find((x) => x.id === id);
          return (
            <Button
              variant="ghost"
              className="px-2.5 py-1 text-[13px]"
              onClick={() => setDetailId(row?.serverId ?? '')}
            >
              Detail
            </Button>
          );
        }}
      />

      <PengelolaDetailModal
        detail={detail}
        locationName={locationName}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
