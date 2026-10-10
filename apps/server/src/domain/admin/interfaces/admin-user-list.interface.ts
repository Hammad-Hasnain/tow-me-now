import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export interface AdminUserListItem {
    id: string;
    name: string;
    identityId: string;
    email: string;
    phone: string;
    role: Role;
    status: IdentityStatus;
    createdAt: Date;
    updatedAt: Date;
}
