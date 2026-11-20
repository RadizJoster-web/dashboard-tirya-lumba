import React from 'react';
import { Button } from '../../components/ui';

interface QuickAddAreaSectionProps {
  show: boolean;
  name: string;
  adding: boolean;
  onChangeName: (val: string) => void;
  onAdd: () => void;
}

export const QuickAddAreaSection: React.FC<QuickAddAreaSectionProps> = ({
  show,
  name,
  adding,
  onChangeName,
  onAdd,
}) => {
  if (!show) return null;

  return (
    <div className="mt-2 mb-2 rounded-lg border border-azure bg-azure/20 p-2.5">
      <span className="block text-xs font-semibold text-primary">Buat Area Baru:</span>
      <div className="mt-1.5 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Nama area/kota baru..."
          className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm focus:border-aqua focus:outline-none"
        />
        <Button
          type="button"
          onClick={onAdd}
          disabled={adding || !name.trim()}
          className="min-h-0 px-3 py-1.5 text-xs whitespace-nowrap"
        >
          {adding ? 'Menyimpan…' : 'Simpan'}
        </Button>
      </div>
    </div>
  );
};
