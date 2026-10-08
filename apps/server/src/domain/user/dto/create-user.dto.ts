import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Full name registration string cannot be omitted.' })
    name!: string;

    @IsEmail({}, { message: 'A structurally accurate email format is required.' })
    @IsNotEmpty({ message: 'Primary authorization lookup email cannot be empty.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'Contact phone configurations cannot be omitted.' })
    phone!: string;

    @IsString()
    @IsNotEmpty({ message: 'A valid text authentication entry password string is required.' })
    @MinLength(6, { message: 'Security input credentials must exceed at least 6 characters.' })
    password!: string;
}
