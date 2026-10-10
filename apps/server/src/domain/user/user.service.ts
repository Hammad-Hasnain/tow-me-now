import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { AdminUserListItem } from '../admin/interfaces/admin-user-list.interface';
import { UserAnalyticsStats } from './interfaces/user-analytics.interface';

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

    async fetchAllUsersForAdmin(): Promise<AdminUserListItem[]> {
        return await this.userModel.aggregate([
            {
                $lookup: {
                    from: 'identities',
                    localField: 'identityId',
                    foreignField: '_id',
                    as: 'identityData'
                }
            },
            {
                $unwind: {
                    path: '$identityData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: '$_id' },
                    name: 1,
                    identityId: { $toString: '$identityId' },
                    email: { $ifNull: ['$identityData.email', 'N/A'] },
                    phone: { $ifNull: ['$identityData.phone', 'N/A'] },
                    role: { $ifNull: ['$identityData.role', 'USER'] },
                    status: { $ifNull: ['$identityData.status', 'PENDING'] },
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
    }

    async getUserStatusAnalytics(): Promise<UserAnalyticsStats> {
        const counts = await this.userModel.aggregate([
            {
                $lookup: {
                    from: 'identities',
                    localField: 'identityId',
                    foreignField: '_id',
                    as: 'identity'
                }
            },
            { $unwind: '$identity' },
            {
                $group: {
                    _id: '$identity.status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats: UserAnalyticsStats = { total: 0, pending: 0, active: 0, deactivated: 0 };
        counts.forEach((item) => {
            const statusKey = item._id.toLowerCase();
            if (statusKey === 'pending') stats.pending = item.count;
            if (statusKey === 'active') stats.active = item.count;
            if (statusKey === 'deactive' || statusKey === 'deactivated') stats.deactivated = item.count;
        });

        stats.total = stats.pending + stats.active + stats.deactivated;
        return stats;
    }
}
