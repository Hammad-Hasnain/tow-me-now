import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        @Inject(forwardRef(() => IdentityService)) private readonly identityService: IdentityService,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
        const { name, email, phone, password } = createUserDto;
        const session = await this.connection.startSession();

        try {
            const createdUser = await session.withTransaction(async () => {
                const identity = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.USER,
                        status: IdentityStatus.ACTIVE,
                    },
                    session,
                );

                const [user] = await this.userModel.create(
                    [
                        {
                            name,
                            identityId: identity._id,
                        },
                    ],
                    { session },
                );

                return user;
            });

            return createdUser;

        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async getProfileByIdentity(identityId: mongoose.Types.ObjectId | string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ identityId });
        if (!user) {
            throw new Error('User profile configuration record not found.');
        }
        return user;
    }

}
