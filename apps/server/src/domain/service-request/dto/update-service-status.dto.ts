import { IsEnum, IsNotEmpty } from 'class-validator';
import { ServiceStatus } from 'src/shared/enums/service-status.enum';

export class UpdateServiceStatusDto {
    @IsEnum(ServiceStatus, { message: 'Operational status update parameter must match a valid progressive transition step (ARRIVED, TOWING, COMPLETED).' })
    @IsNotEmpty({ message: 'Target trip sequence execution status cannot be omitted.' })
    status!: ServiceStatus;
}
