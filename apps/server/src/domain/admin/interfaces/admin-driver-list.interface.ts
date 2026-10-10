import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

export interface AdminDriverListItem {
    id: string;
    name: string;
    identityId: string;
    email: string;
    phone: string;
    role: Role;
    status: IdentityStatus;
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
