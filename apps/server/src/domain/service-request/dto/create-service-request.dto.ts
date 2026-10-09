import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsNumber()
    @IsNotEmpty({ message: 'Location latitude coordinate is required.' })
    latitude!: number;

    @IsNumber()
    @IsNotEmpty({ message: 'Location longitude coordinate is required.' })
    longitude!: number;

    @IsString()
    @IsNotEmpty({ message: 'Location clear address text string cannot be omitted.' })
    address!: string;
}

export class CreateServiceRequestDto {
    @IsString()
    @IsNotEmpty({ message: 'User primary identifier string parameter is required.' })
    userId!: string;

    @IsString()
    @IsNotEmpty({ message: 'Target breakdown vehicle category name is required.' })
    vehicle!: string;

    @IsString()
    @IsNotEmpty({ message: 'Vehicle production model description string cannot be omitted.' })
    model!: string;

    @IsString()
    @IsNotEmpty({ message: 'Breakdown description problem statement parameter is required.' })
    problem!: string;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty({ message: 'Pickup coordinates mapping profile block is required.' })
    pickupLoc!: LocationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty({ message: 'Dropoff destination coordinates mapping profile block is required.' })
    dropoffLoc!: LocationDto;
}
