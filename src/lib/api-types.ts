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

export interface ServerUser {
  userId: string;
  email: string;
  role: string;
}

export interface ServerLogin {
  token: string;
  user: ServerUser;
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

/** Referensi master data mentah dari server untuk opsi <select> form pendaftaran. */
export interface RefStore {
  locations: ServerLocation[];
  packages: ServerPackage[];
  instructors: ServerInstructor[];
}
