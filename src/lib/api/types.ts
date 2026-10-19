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
  location?: { name: string; area?: { name?: string } };
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

// Attendance endpoints are not documented yet; shapes follow the dashboard's local draft model.
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

export interface ServerProfil {
  userId: string;
  nama: string;
  email: string;
  role: string;
  lokasi?: string;
  avatarUrl?: string;
}
