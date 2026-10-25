import { AbsensiLoading } from '../../components/loading';
import AbsensiAdminView from './AbsensiAdminView';
import AbsensiManagerView from './AbsensiManagerView';
import { useAbsensiData } from './useAbsensiData';

export default function Absensi() {
  const {
    admin,
    lokasi,
    absen,
    locations,
    people,
    loading,
    submitAttendance,
  } = useAbsensiData();

  if (loading) {
    return <AbsensiLoading admin={admin} />;
  }

  if (admin) {
    return <AbsensiAdminView locations={locations} absen={absen} />;
  }

  return (
    <AbsensiManagerView
      lokasi={lokasi}
      people={people}
      onSave={submitAttendance}
    />
  );
}
