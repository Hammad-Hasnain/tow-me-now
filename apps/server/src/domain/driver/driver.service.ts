import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';
import { ToggleDutyDto } from './dto/toggle-duty.dto';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

@Injectable()
export class DriverService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<DriverDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
        @Inject(forwardRef(() => IdentityService)) private readonly identityService: IdentityService,
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

    async getProfileByIdentity(identityId: mongoose.Types.ObjectId | string): Promise<DriverDocument> {
        const driver = await this.driverModel.findOne({ identityId });
        if (!driver) {
            throw new Error('Driver profile configuration record not found.');
        }
        return driver;
    }

    async updateDutyAndLocation(toggleDutyDto: ToggleDutyDto): Promise<DriverDocument> {
        const { driverId, dutyStatus, currentLocation } = toggleDutyDto;

        const driver = await this.driverModel.findById(driverId);
        if (!driver) {
            throw new NotFoundException('Driver database profile registration record not found.');
        }

        driver.dutyStatus = dutyStatus;
        driver.currentLocation = {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            address: currentLocation.address,
        };

        return await driver.save();
    }

    async findAvailableDriversWithCoordinates(): Promise<DriverDocument[]> {
        return await this.driverModel.find({
            dutyStatus: DutyStatus.AVAILABLE,
            'currentLocation.latitude': { $ne: null },
            'currentLocation.longitude': { $ne: null }
        });
    }

}
