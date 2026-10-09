import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ServiceRequest, ServiceRequestDocument } from './schemas/service-request.schema';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { AvailableDriverCard } from './interfaces/available-drivers-response.interface';
import { calculateHaversineDistance } from 'src/shared/utils/geo-distance.util';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';
import { DriverService } from '../driver/driver.service';

@Injectable()
export class ServiceRequestService {
    constructor(
        @InjectModel(ServiceRequest.name) private readonly serviceRequestModel: Model<ServiceRequestDocument>,
        private readonly driverService: DriverService,
    ) { }

    async createRequest(createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequestDocument> {
        try {
            const { userId, vehicle, model, problem, pickupLoc, dropoffLoc } = createServiceRequestDto;

            const requestInstance = new this.serviceRequestModel({
                userId: new mongoose.Types.ObjectId(userId),
                driverId: null,
                vehicle,
                model,
                problem,
                pickupLoc,
                dropoffLoc,
                fare: 0,
            });

            return await requestInstance.save();
        } catch (error) {
            throw new InternalServerErrorException('Failed to process and register the highway towing rescue request.');
        }
    }

    async getCalculatedAvailableDrivers(requestId: string): Promise<AvailableDriverCard[]> {
        // 1. Fetch current active service request data details
        const request = await this.serviceRequestModel.findById(requestId);
        if (!request) {
            throw new NotFoundException('Service request context log not found.');
        }

        const { latitude: pickupLat, longitude: pickupLon } = request.pickupLoc;

        // 2. Scan and query only AVAILABLE drivers from database with active coordinates
        const activeDrivers = await this.driverService.findAvailableDriversWithCoordinates();

        const driverCardsList: AvailableDriverCard[] = [];

        // 3. Mathematical matrix generation iterations block loops without identity lookup overload
        for (const driver of activeDrivers) {
            const driverObj = driver.toObject();

            // Calculate distance parameters from active Driver location up to User breakdown pickup coordinates point
            const computedDistance = calculateHaversineDistance(
                driverObj.currentLocation.latitude!,
                driverObj.currentLocation.longitude!,
                pickupLat,
                pickupLon
            );

            // Dynamic Pricing Strategy allocations based on truck classification tags
            let baseFare = 1000;
            let ratePerKm = 50;

            if (driverObj.vehicleType === VehicleType.WHEEL_LIFT) {
                baseFare = 1500;
                ratePerKm = 70;
            } else if (driverObj.vehicleType === VehicleType.FLAT_BED) {
                baseFare = 2500;
                ratePerKm = 100;
            }

            const dynamicCalculatedFare = baseFare + Math.round(computedDistance * ratePerKm);

            // Mapping output objects variables strictly using your custom key specifications
            driverCardsList.push({
                driverId: driverObj._id.toString(),
                driverName: driverObj.name,
                vehicle: driverObj.vehicleType,
                vehicleNum: driverObj.vehicleNumber,
                distance: computedDistance,
                fare: dynamicCalculatedFare
            });
        }

        // Sort calculations list sequence arrays dynamically (Nearest drivers show up first on screen)
        return driverCardsList.sort((a, b) => a.distance - b.distance);
    }
}
