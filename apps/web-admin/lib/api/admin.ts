import { apiClient, setAuthToken, clearAuthToken } from "./client";

export type IdentityStatus = "PENDING" | "ACTIVE" | "DEACTIVE";
export type DutyStatus = "AVAILABLE" | "OFFLINE" | "ON_DUTY";
export type VehicleType = "FLAT_BED" | "WHEEL_LIFT" | "HOOK_AND_CHAIN" | "INTEGRATED";
export type ServiceStatus =
  | "PENDING"
  | "ACCEPTED"
  | "ARRIVED"
  | "TOWING"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name?: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER" | "DRIVER";
  status: IdentityStatus;
  identityId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AdminUser;
}

export interface ApiUserItem {
  id: string;
  name: string;
  identityId: string;
  email: string;
  phone: string;
  role: string;
  status: IdentityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDriverItem {
  id: string;
  name: string;
  identityId: string;
  email: string;
  phone: string;
  role: string;
  status: IdentityStatus;
  vehicleType: VehicleType | string;
  vehicleNumber: string;
  cnic: string | null;
  license: string | null;
  vehiclePaper: string | null;
  profile: string | null;
  earnings: number;
  serviceReqAcc: number;
  serviceReqRej: number;
  dutyStatus: DutyStatus | string;
  currentLocation: {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiServiceRequestItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  driverId: string | null;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  model: string;
  problem: string;
  pickupLoc: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLoc: {
    latitude: number;
    longitude: number;
    address: string;
  };
  fare: number;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardAnalytics {
  users: {
    total: number;
    pending: number;
    active: number;
    deactivated: number;
  };
  drivers: {
    total: number;
    pending: number;
    active: number;
    deactivated: number;
  };
  serviceRequests: {
    total: number;
    pending: number;
    accepted: number;
    arrived: number;
    towing: number;
    completed: number;
    rejected: number;
    cancelled: number;
  };
}

export const adminApi = {
  // Login API
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const data = await apiClient<LoginResponse>("/identity/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });
    if (data.accessToken) {
      setAuthToken(data.accessToken);
    }
    return data;
  },

  logout: () => {
    clearAuthToken();
  },

  // 13. Fetch Users for Admin
  getUsers: async (): Promise<ApiUserItem[]> => {
    return apiClient<ApiUserItem[]>("/admin/users", {
      method: "GET",
    });
  },

  // 14. Fetch Drivers for Admin
  getDrivers: async (): Promise<ApiDriverItem[]> => {
    return apiClient<ApiDriverItem[]>("/admin/drivers", {
      method: "GET",
    });
  },

  // 15. Fetch Service Requests for Admin
  getServiceRequests: async (): Promise<ApiServiceRequestItem[]> => {
    return apiClient<ApiServiceRequestItem[]>("/admin/service-requests", {
      method: "GET",
    });
  },

  // 16. Fetch Dashboard Analytics
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    return apiClient<DashboardAnalytics>("/admin/analytics/dashboard", {
      method: "GET",
    });
  },

  // 17. Update Driver Identity Status
  updateDriverStatus: async (
    identityId: string,
    status: IdentityStatus
  ): Promise<any> => {
    return apiClient<any>(`/admin/driver/${identityId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
