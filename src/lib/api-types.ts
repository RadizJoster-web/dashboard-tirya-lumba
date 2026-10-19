// Response shapes from API_DOCUMENTATION.md, trimmed to the fields this dashboard reads.

export interface ServerArea {
  id: string;
  name: string;
}

export interface ServerLocation {
  id: string;
  name: string;
  category?: string;
  mapUrl?: string;
  areaId?: string;
  areaName?: string;
  regularPrice?: number;
}

export interface ServerPackage {
  id: string;
  locationId: string;
  type: string;
  price: number;
}

export interface ServerSession {
  id: string;
  dayOfWeek: string;
  sessionName: string;
  startTime: string;
  endTime: string;
  locationId: string | null;
}

export interface ServerPoolManager {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  locationId?: string;
  location?: { name: string; area?: { name: string } };
}

export interface ServerInstructor {
  id: string;
  fullName: string;
  phone?: string;
  profilePictureUrl?: string;
  isActive: boolean;
}

export interface ServerInstructorDetail extends ServerInstructor {
  email?: string;
  isVerified?: boolean;
  instructorProfile?: {
    shortBio?: string;
    license?: string;
    experience?: string;
    locations?: Array<{ id: string; name: string; area?: { name?: string } }>;
  };
}

export interface ServerUser {
  userId: string;
  email: string;
  role: string;
}

export interface ServerLogin {
  token: string;
  user: ServerUser;
}

// ---------- Modul Absensi (belum ada di dokumentasi backend, disiapkan untuk sinkronisasi) ----------

export interface ServerAbsen {
  id?: string;
  tgl: string;
  nama: string;
  peran: 'Murid' | 'Pelatih';
  lokasi: string;
  st: 'Hadir' | 'Tidak Hadir';
}

export interface AbsenPayload {
  tgl: string;
  nama: string;
  peran: 'Murid' | 'Pelatih';
  lokasi: string;
  st: 'Hadir' | 'Tidak Hadir';
}

export interface AbsenResult {
  success: boolean;
  message?: string;
  data?: ServerAbsen[];
}

// ---------- Siswa ----------
export interface ServerSiswa {
  id: string;
  nama: string;
  usia: number;
  lokasi: string;
  paket: string;
  berlakuSd: string;
  aktif: boolean;
  telp: string;
  fotoUrl?: string;
  profilePictureUrl?: string;
}

export interface SiswaPayload {
  nama: string;
  usia: number;
  lokasi: string;
  paket: 'Reguler' | 'Privat';
  berlakuSd: string;
  telp: string;
  aktif?: boolean;
}

// ---------- Pelatih ----------
export interface ServerPelatih {
  id: string;
  nama: string;
  lokasi: string;
  lisensi?: string;
  jadwal?: string;
  riwayat?: string;
}

export interface PelatihPayload {
  nama: string;
  lokasi: string;
  lisensi?: string;
  jadwal?: string;
  riwayat?: string;
}

// ---------- Pengelola ----------
export interface ServerPengelola {
  id: string;
  nama: string;
  telp: string;
  lokasi: string;
  fotoUrl?: string;
}

export interface PengelolaPayload {
  nama: string;
  telp: string;
  lokasi: string;
  fotoUrl?: string;
}

// ---------- Jadwal / Sesi ----------
export interface ServerSesi {
  id: string;
  lokasi: string;
  hari: string;
  sesi: string;
  jam: string;
  pelatih: string;
}

export interface SesiPayload {
  lokasi: string;
  hari: string;
  sesi: string;
  jam: string;
  pelatih: string;
}

// ---------- Reschedule ----------
export interface ServerResched {
  id: string;
  pelatih: string;
  sesiId: string;
  hari: string;
  jam: string;
  alasan: string;
}

export interface ReschedPayload {
  pelatih: string;
  sesiId: string;
  hari: string;
  jam: string;
  alasan: string;
}

// ---------- Profil ----------
export interface ServerProfil {
  userId: string;
  nama: string;
  email: string;
  role: string;
  lokasi?: string;
  avatarUrl?: string;
}

// ---------- Modul Pendaftaran & Booking (§9, §10) ----------

export interface RegisterStudentPayload {
  profilePictureUrl?: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  schoolOrOffice: string;
  tshirtSize: string;
  locationId: string;
  packageId: string;
  firstMeetDate: string;
  firstMeetSession: string;
  instructorId: string;
  paymentMethod: string;
  paymentProofUrl?: string;
}

export interface ScheduleSlot {
  locationId: string;
  dayOfWeek: string;
  sessionName: string;
}

export interface RegisterInstructorPayload {
  fullName: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  shortBio: string;
  license: string;
  experience: string;
  schedules: ScheduleSlot[];
  profilePictureUrl?: string;
  cvUrl?: string;
}

export interface RegisterResult {
  registrationId: string;
  userId?: string;
  status?: string;
  fullName?: string;
  phone?: string;
  totalSchedulesCreated?: number;
}

/** Bentuk data upload bisa beragam antar endpoint; disatukan agar pemanggil mudah. */
export interface UploadOutcome {
  profilePictureUrl?: string;
  cvUrl?: string;
  paymentProofUrl?: string;
  raw?: unknown;
}

export function pickUrl(value: unknown, keys: string[]): string | undefined {
  if (typeof value === 'string' && value.length > 0 && keys.length === 0) return value;
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const k of keys) {
      const v = obj[k];
      if (typeof v === 'string' && v.length > 0) return v;
    }
  }
  return undefined;
}
