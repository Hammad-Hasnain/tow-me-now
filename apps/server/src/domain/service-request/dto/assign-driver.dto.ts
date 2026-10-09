import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AssignDriverDto {
    @IsString()
    @IsNotEmpty({ message: 'Target driver identification string parameter is required.' })
    driverId!: string;

    @IsNumber()
    @IsNotEmpty({ message: 'Dynamic calculated trip fare amount parameter is required.' })
    fare!: number;
}
