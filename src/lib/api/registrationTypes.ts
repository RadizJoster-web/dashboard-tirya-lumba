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
