import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { AdminUserListItem } from './interfaces/admin-user-list.interface';
import { UserService } from '../user/user.service';
import { DriverService } from '../driver/driver.service';
import { AdminDriverListItem } from './interfaces/admin-driver-list.interface';
import { ServiceRequestService } from '../service-request/service-request.service';
import { AdminServiceRequestListItem } from './interfaces/admin-service-request-list.interface';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        @Inject(forwardRef(() => IdentityService)) private readonly identityService: IdentityService,
        private readonly userService: UserService,
        private readonly driverService: DriverService,
        private readonly serviceRequestService: ServiceRequestService,
    ) { }

    async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
        const { name, email, phone, password } = createAdminDto;
        const session = await this.connection.startSession();

        try {
            const createdAdmin = await session.withTransaction(async () => {
                const identity = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.ADMIN,
                        status: IdentityStatus.ACTIVE,
                    },
                    session,
                );

                const [admin] = await this.adminModel.create(
                    [
                        {
                            name,
                            identityId: identity._id,
                        },
                    ],
                    { session },
                );

                return admin;
            });

            return createdAdmin;

        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
        }
    }

    async getProfileByIdentity(identityId: mongoose.Types.ObjectId | string): Promise<AdminDocument> {
        const admin = await this.adminModel.findOne({ identityId });
        if (!admin) {
            throw new Error('Admin profile configuration record not found.');
        }
        return admin;
    }

    async fetchAllUsersForAdmin(): Promise<AdminUserListItem[]> {
        return await this.userService.fetchAllUsersForAdmin();
    }

    async fetchAllDriversForAdmin(): Promise<AdminDriverListItem[]> {
        return await this.driverService.fetchAllDriversForAdmin();
    }

    async fetchAllServiceRequestsForAdmin(): Promise<AdminServiceRequestListItem[]> {
        return await this.serviceRequestService.fetchAllRequestsForAdmin();
    }
}
