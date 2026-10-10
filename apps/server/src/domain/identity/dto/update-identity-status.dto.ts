import { IsEnum, IsNotEmpty } from 'class-validator';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class UpdateIdentityStatusDto {
    @IsEnum(IdentityStatus, { message: 'Operational status value must match system options (PENDING, ACTIVE, DEACTIVE).' })
    @IsNotEmpty({ message: 'Target profile status assignment configuration cannot be omitted.' })
    status!: IdentityStatus;
}
