import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

// 1. Identity Base Profile 
export interface IdentityBaseProfile {
    email: string;
    phone: string;
    status: IdentityStatus;
    role: Role;
}

// 2. User Profile Response 
export interface UserProfileResponse extends IdentityBaseProfile {
    id: string;
    name: string;
    identityId: string;
    createdAt: Date;
    updatedAt: Date;
}

// 3. Driver Profile Response 
export interface DriverProfileResponse extends IdentityBaseProfile {
    id: string;
    name: string;
    identityId: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    cnic: string | null;
    license: string | null;
    vehiclePaper: string | null;
    profile: string | null;
    earnings: number;
    serviceReqAcc: number;
    serviceReqRej: number;
    dutyStatus: DutyStatus;
    currentLocation: {
        latitude: number | null;
        longitude: number | null;
        address: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminProfileResponse extends IdentityBaseProfile {
    id: string;
    name: string;
    identityId: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UnifiedUserProfile = UserProfileResponse | DriverProfileResponse | AdminProfileResponse;

export interface LoginResponse {
    accessToken: string;
    user: UnifiedUserProfile;
}
