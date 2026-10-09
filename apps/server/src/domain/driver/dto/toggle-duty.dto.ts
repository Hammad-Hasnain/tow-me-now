import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

class UpdateLocationDto {
    @IsNumber()
    @IsNotEmpty({ message: 'Current latitude tracking coordinate is required.' })
    latitude!: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Current longitude tracking coordinate is required.' })
    longitude!: number;

    @IsString()
    @IsNotEmpty({ message: 'Current physical human-readable location address string is required.' })
    address!: string;
}

export class ToggleDutyDto {
    @IsString()
    @IsNotEmpty({ message: 'Driver collection unique baseline document identifier string is required.' })
    driverId!: string;

    @IsEnum(DutyStatus, { message: 'Duty toggle configuration parameter must match valid options (AVAILABLE, OFFLINE).' })
    @IsNotEmpty({ message: 'Operational target duty tracking status assignment cannot be omitted.' })
    dutyStatus!: DutyStatus;

    @IsObject()
    @ValidateNested()
    @Type(() => UpdateLocationDto)
    @IsNotEmpty({ message: 'Live mobile network location parameters are mandatory for switching tracking blocks.' })
    currentLocation!: UpdateLocationDto;
}
