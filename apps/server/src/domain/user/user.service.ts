import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        private readonly identityService: IdentityService,
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
}
