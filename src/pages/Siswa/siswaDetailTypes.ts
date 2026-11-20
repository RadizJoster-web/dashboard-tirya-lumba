export interface AttendanceRecord {
  id: string;
  role: string;
  name: string;
  locationName: string;
  date: string;
  status: string;
}

export interface RegistrationRecord {
  id: string;
  type: string;
  status: string;
  firstMeetDate?: string;
  firstMeetSession?: string;
  locationName: string;
  packageName: string;
  createdAt: string;
}

export interface StudentProfileData {
  id: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  schoolOrOffice: string;
  tshirtSize: string;
  activeSessions: number;
  attendances?: AttendanceRecord[];
}

export interface ServerSiswaDetail {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  isVerified: boolean;
  profilePictureUrl?: string;
  fotoUrl?: string;
  createdAt?: string;
  usia: number;
  lokasi: string;
  paket: string;
  berlakuSd: string;
  studentProfile: StudentProfileData | null;
  registrations: RegistrationRecord[];
}
