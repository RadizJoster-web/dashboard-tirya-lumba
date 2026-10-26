// Response shapes from API_DOCUMENTATION.md, trimmed to the fields this dashboard reads.

export interface ServerArea {
  id: string;
  name: string;
  _count?: {
    locations: number;
  };
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
  sessionCount?: number;
}

export interface DashboardSummaryData {
  totalSiswa: number;
  totalGuru: number;
  totalPendaftar: number;
  chartData: {
    data: number[];
    labels: string[];
    total: number;
    title: string;
    subtitle: string;
    statLabel: string;
  };
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

export interface ServerRegistration {
  id: string;
  type: 'NEW_STUDENT' | 'NEW_INSTRUCTOR' | 'RENEWAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  name: string;
  email: string | null;
  phone: string | null;
  lokasi: string;
  birthDate: string | null;
  profilePictureUrl: string | null;
  cvUrl: string | null;
  paymentProofUrl: string | null;
  rejectionReason: string | null;
}

export interface ServerRegistrationDetail extends ServerRegistration {
  packageId?: string | null;
  locationId?: string | null;
  instructorId?: string | null;
  firstMeetDate?: string | null;
  firstMeetSession?: string | null;
  paymentMethod?: string | null;
  package?: { id: string; type: string; price: number } | null;
  location?: { id: string; name: string } | null;
  instructor?: { id: string; fullName: string; phone?: string } | null;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    profilePictureUrl?: string;
    studentProfile?: {
      fullName: string;
      birthPlace: string;
      birthDate: string;
      gender: string;
      address: string;
      schoolOrOffice: string;
      tshirtSize: string;
    } | null;
    instructorProfile?: {
      shortBio?: string;
      license?: string;
      experience?: string;
      locations?: Array<{ id: string; name: string }>;
    } | null;
  } | null;
  schedules?: Array<{
    id: string;
    dayOfWeek: string;
    sessionName: string;
    locationId: string;
    location?: { id: string; name: string };
  }>;
}
