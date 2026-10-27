import { Plus } from 'lucide-react';
import { Button } from '../ui';

interface CrudHeaderProps {
  title: string;
  subtitle: string;
  addLabel: string;
  onAddClick: () => void;
}

export default function CrudHeader({ title, subtitle, addLabel, onAddClick }: CrudHeaderProps) {
  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-bold text-[#1D3557] tracking-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 font-normal">{subtitle}</p>
      </div>
      <Button onClick={onAddClick} size="sm">
        <Plus size={14} className="mr-1" />
        {addLabel}
      </Button>
    </div>
  );
}
