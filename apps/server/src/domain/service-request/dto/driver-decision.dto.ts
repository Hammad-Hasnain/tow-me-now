import { IsIn, IsNotEmpty } from 'class-validator';

export class DriverDecisionDto {
    @IsIn(['ACCEPT', 'REJECT'], { message: 'Operational choice choice must match valid state actions.' })
    @IsNotEmpty()
    decision!: 'ACCEPT' | 'REJECT';
}
