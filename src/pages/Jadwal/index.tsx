import { toast } from 'sonner';
import { JadwalLoading } from '../../components/loading';
import { HARI } from '../../lib/format';
import { slotKey } from '../../components/jadwal/session-templates';
import JadwalHeader from './JadwalHeader';
import JadwalContent from './JadwalContent';
import JadwalDialogs from './JadwalDialogs';
import { useTemplateState } from './useTemplateState';
import { useSessionDialogs } from './useSessionDialogs';
import { useJadwalData } from './useJadwalData';
import { useScheduleSelection } from './useScheduleSelection';

export default function Jadwal() {
  const templateState = useTemplateState();

  const {
    locations,
    locationsLoading,
    activeLocationId,
    locationName,
    changeLocation: setLocationId,
    sessions,
    sessionData,
    sessionsError,
    existing,
    reloadSessions,
    submitSchedule,
  } = useJadwalData();

  const { selected, toggleSlot, toggleRow, clearSelected } =
    useScheduleSelection(existing);

  const dialogs = useSessionDialogs({ onReload: reloadSessions });

  function changeLocation(id: string) {
    setLocationId(id);
    clearSelected();
    dialogs.setSavedOpen(false);
  }

  async function handleSubmitSchedule() {
    if (!activeLocationId) {
      return toast.error('Pilih lokasi kolam terlebih dahulu.', {
        style: { color: '#B3341F' },
      });
    }
    const additions = templateState.templates.flatMap((template) =>
      HARI.filter((day) =>
        selected.has(slotKey(template.name, day)),
      ).map((day) => ({
        sessionName: template.name,
        dayOfWeek: day,
        startTime: template.startTime,
        endTime: template.endTime,
        locationId: activeLocationId,
      })),
    );
    if (additions.length === 0) {
      return toast.error('Centang minimal satu sesi pada hari yang dipilih.', {
        style: { color: '#B3341F' },
      });
    }

    dialogs.setSaving(true);
    const ok = await submitSchedule(additions);
    if (ok) {
      clearSelected();
    }
    dialogs.setSaving(false);
  }

  if (
    locationsLoading ||
    (activeLocationId && !sessionData && !sessionsError)
  ) {
    return <JadwalLoading />;
  }

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <JadwalHeader
        sessionsError={sessionsError}
        onRetry={() => void reloadSessions()}
      />
      <JadwalContent
        templates={templateState.templates}
        templateName={templateState.templateName}
        startTime={templateState.startTime}
        nextEnd={templateState.nextEnd}
        onNameChange={templateState.setTemplateName}
        onStartTimeChange={templateState.setStartTime}
        onAddTemplate={templateState.addTemplate}
        onRemoveTemplate={templateState.removeTemplate}
        locations={locations}
        activeLocationId={activeLocationId}
        locationName={locationName}
        existing={existing}
        selected={selected}
        saving={dialogs.saving}
        onLocationChange={changeLocation}
        onToggleSlot={toggleSlot}
        onToggleRow={toggleRow}
        onOpenSaved={() => dialogs.setSavedOpen(true)}
        onSubmitSchedule={() => void handleSubmitSchedule()}
      />
      <JadwalDialogs
        savedOpen={dialogs.savedOpen}
        locationName={locationName}
        sessions={sessions}
        editTarget={dialogs.editTarget}
        deleteTarget={dialogs.deleteTarget}
        saving={dialogs.saving}
        onCloseSaved={() => dialogs.setSavedOpen(false)}
        onSelectEdit={dialogs.setEditTarget}
        onSelectDelete={dialogs.setDeleteTarget}
        onCloseEdit={() => dialogs.setEditTarget(null)}
        onCloseDelete={() => dialogs.setDeleteTarget(null)}
        onSaveEdit={dialogs.saveEdit}
        onDeleteSession={() => void dialogs.deleteSession()}
      />
    </div>
  );
}
