export interface StudentAllocation {
  id: string;
  name: string;
  phone: string | null;
  packageName: string;
  firstMeetDate: string | null;
  firstMeetSession: string | null;
  isActive: boolean;
  activeSessions: number;
}

export interface CoachAllocation {
  id: string;
  fullName: string;
  phone: string | null;
  profilePictureUrl: string | null;
  totalStudents: number;
  students: StudentAllocation[];
}

export interface PoolCapacityItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string | null;
  mapUrl: string | null;
  areaName: string | null;
  isCoachRegistrationOpen: boolean;
  totalInstructors: number;
  totalStudents: number;
  coaches: CoachAllocation[];
}

export interface PoolCapacityData {
  globalStats: {
    totalActiveInstructors: number;
    totalActiveStudents: number;
  };
  pools: PoolCapacityItem[];
}
