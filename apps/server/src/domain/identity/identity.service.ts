import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Identity, IdentityDocument } from './schemas/identity.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateIdentityDto } from './dto/create-identity.dto';
import * as bcrypt from 'bcrypt';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class IdentityService {
    private readonly saltRounds: number;

    constructor(
        @InjectModel(Identity.name) private readonly identityModel: Model<IdentityDocument>,
        private readonly configService: ConfigService,
    ) {
        this.saltRounds = Number(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || 10);
    }

    async createIdentity(
        createIdentityDto: CreateIdentityDto,
        session?: ClientSession,
    ): Promise<IdentityDocument> {
        const { email, password, phone, role } = createIdentityDto;

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
                    roles: [role],
                    status: IdentityStatus.ACTIVE,
                },
            ],
            { session },
        );

        return identity;
    }
}
