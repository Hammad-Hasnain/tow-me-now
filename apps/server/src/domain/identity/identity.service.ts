import { ConflictException, Injectable, NotFoundException, UnauthorizedException, ForbiddenException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Identity, IdentityDocument } from './schemas/identity.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateIdentityDto } from './dto/create-identity.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { DriverService } from '../driver/driver.service';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse, UnifiedUserProfile } from './interfaces/login-response.interface';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { Role } from 'src/shared/enums/role.enum';


@Injectable()
export class IdentityService {
    private readonly saltRounds: number;

    constructor(
        @InjectModel(Identity.name) private readonly identityModel: Model<IdentityDocument>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        @Inject(forwardRef(() => DriverService)) private readonly driverService: DriverService,
        @Inject(forwardRef(() => AdminService)) private readonly adminService: AdminService,
    ) {
        this.saltRounds = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || 10);
    }

    async createIdentity(
        createIdentityDto: CreateIdentityDto,
        session?: ClientSession,
    ): Promise<IdentityDocument> {
        const { email, password, phone, role, status } = createIdentityDto;

        const existing = await this.identityModel
            .findOne({ email })
            .session(session ?? null);

        if (existing) {
            throw new ConflictException('An authentication identity with this email address already exists.');
        }

        const passwordHash = await bcrypt.hash(password, this.saltRounds);

        const [identity] = await this.identityModel.create(
            [
                {
                    email,
                    passwordHash,
                    phone,
                    role,
                    status,
                },
            ],
            { session },
        );

        return identity;
    }

    async validateAndLogin(loginDto: LoginDto): Promise<LoginResponse> {
        const { email, password } = loginDto;

        // 1. Fetch Identity & Validate
        const identity = await this.identityModel.findOne({ email }).select('+passwordHash');
        if (!identity) {
            throw new UnauthorizedException('Invalid operational credentials provided.');
        }

        // 2. Status Check using Switch
        switch (identity.status) {
            case IdentityStatus.DEACTIVE:
                throw new ForbiddenException('This profile configuration has been deactivated by system administrative operations.');
            case IdentityStatus.PENDING:
                throw new ForbiddenException('This profile is under review. Please contact admin if not yet approved.');
        }

        // 3. Password Verification
        const isPasswordMatch = await bcrypt.compare(password, identity.passwordHash);
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid operational credentials provided.');
        }

        // 4. Generate JWT
        const payload = { sub: identity._id.toString(), email: identity.email, role: identity.role };
        const accessToken = await this.jwtService.signAsync(payload);

        try {
            // 5. Dynamic Profile Fetching based on Role
            let profileService: any;
            if (identity.role === Role.USER) profileService = this.userService;
            else if (identity.role === Role.DRIVER) profileService = this.driverService;
            else profileService = this.adminService;

            const profile = await profileService.getProfileByIdentity(identity._id);
            if (!profile) {
                throw new NotFoundException('Profile linkage definitions data corrupted or entry omitted.');
            }

            const identityObj = identity.toObject();
            const { _id, __v, ...profileObj } = profile.toObject();

            const userProfile: UnifiedUserProfile = {
                email: identityObj.email,
                phone: identityObj.phone,
                status: identityObj.status,
                role: identityObj.role,

                // Profile fields
                ...profileObj,
                id: _id.toString(),
            };

            return { accessToken, user: userProfile };

        } catch (error) {
            throw new NotFoundException((error as Error).message || 'Profile linkage definitions data corrupted or entry omitted.');
        }
    }

}
