import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class DriverService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<DriverDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        private readonly identityService: IdentityService,
    ) { }

    async createDriver(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        const { name, email, phone, password, vehicleType, vehicleNumber, ...optionalFields } = createDriverDto;
        const session = await this.connection.startSession();

        try {
            const createdDriver = await session.withTransaction(async () => {
                const identity = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.DRIVER,
                    },
                    session,
                );

                const [driver] = await this.driverModel.create(
                    [
                        {
                            name,
                            identityId: identity._id,
                            vehicleType,
                            vehicleNumber,
                            ...optionalFields,
                        },
                    ],
                    { session },
                );

                return driver;
            });

            return createdDriver;

        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
