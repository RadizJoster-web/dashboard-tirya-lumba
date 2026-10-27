import type { FormEvent } from 'react';
import TemplateSection from '../../components/jadwal/TemplateSection';
import WeeklyMatrix from '../../components/jadwal/WeeklyMatrix';
import type { ServerLocation } from '../../lib/api/types';
import type { SessionTemplate } from '../../components/jadwal/session-templates';

interface JadwalContentProps {
  templates: SessionTemplate[];
  templateName: string;
  startTime: string;
  nextEnd: string;
  onNameChange: (v: string) => void;
  onStartTimeChange: (v: string) => void;
  onAddTemplate: (e: FormEvent<HTMLFormElement>) => void;
  onRemoveTemplate: (id: string) => void;
  locations: ServerLocation[];
  activeLocationId: string;
  locationName: string;
  existing: Set<string>;
  selected: Set<string>;
  saving: boolean;
  onLocationChange: (id: string) => void;
  onToggleSlot: (key: string) => void;
  onToggleRow: (template: SessionTemplate) => void;
  onOpenSaved: () => void;
  onSubmitSchedule: () => void;
}

export default function JadwalContent({
  templates,
  templateName,
  startTime,
  nextEnd,
  onNameChange,
  onStartTimeChange,
  onAddTemplate,
  onRemoveTemplate,
  locations,
  activeLocationId,
  locationName,
  existing,
  selected,
  saving,
  onLocationChange,
  onToggleSlot,
  onToggleRow,
  onOpenSaved,
  onSubmitSchedule,
}: JadwalContentProps) {
  return (
    <div className="flex flex-col gap-6 w-full min-w-0 max-w-full">
      <TemplateSection
        templates={templates}
        templateName={templateName}
        startTime={startTime}
        nextEnd={nextEnd}
        onNameChange={onNameChange}
        onStartTimeChange={onStartTimeChange}
        onSubmit={onAddTemplate}
        onRemove={onRemoveTemplate}
      />

      <WeeklyMatrix
        locations={locations}
        activeLocationId={activeLocationId}
        locationName={locationName}
        templates={templates}
        existing={existing}
        selected={selected}
        saving={saving}
        onLocationChange={onLocationChange}
        onToggle={onToggleSlot}
        onToggleRow={onToggleRow}
        onOpenSaved={onOpenSaved}
        onSubmit={onSubmitSchedule}
      />
    </div>
  );
}
