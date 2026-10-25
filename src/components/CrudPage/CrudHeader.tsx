import { Button } from '../ui';

interface CrudHeaderProps {
  title: string;
  subtitle: string;
  addLabel: string;
  onAddClick: () => void;
}

export default function CrudHeader({ title, subtitle, addLabel, onAddClick }: CrudHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl leading-8 font-bold">{title}</h2>
        <p className="text-slate-500">{subtitle}</p>
      </div>
      <Button onClick={onAddClick}>{addLabel}</Button>
    </div>
  );
}
