import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';

export class CreateDriverDto {
    @IsString()
    @IsNotEmpty({ message: 'Driver registration display name cannot be omitted.' })
    name!: string;

    @IsEmail({}, { message: 'A structurally accurate email format is required.' })
    @IsNotEmpty({ message: 'Primary authorization lookup email cannot be empty.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact phone configuration string cannot be omitted.' })
    phone!: string;

    @IsString()
    @IsNotEmpty({ message: 'A valid text authentication entry password string is required.' })
    @MinLength(6, { message: 'Security input credentials must exceed at least 6 characters.' })
    password!: string;

    @IsEnum(VehicleType, { message: 'Selected vehicle configuration must match valid system options (HOOK_AND_CHAIN, WHEEL_LIFT, FLAT_BED).' }) // 👈 Validates payload clean against runtime Enum metadata configurations
    @IsNotEmpty({ message: 'Primary operational vehicle classification selection is required.' })
    vehicleType!: VehicleType;

    @IsString()
    @IsNotEmpty({ message: 'Vehicle license plate identity registration text cannot be omitted.' })
    vehicleNumber!: string;

    @IsString()
    @IsOptional()
    cnic?: string;

    @IsString()
    @IsOptional()
    license?: string;

    @IsString()
    @IsOptional()
    vehiclePaper?: string;

    @IsString()
    @IsOptional()
    profile?: string;
}
