import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ServiceRequest, ServiceRequestDocument } from './schemas/service-request.schema';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { AvailableDriverCard } from './interfaces/available-drivers-response.interface';
import { calculateHaversineDistance } from 'src/shared/utils/geo-distance.util';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';
import { DriverService } from '../driver/driver.service';
import { ServiceStatus } from 'src/shared/enums/service-status.enum';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { DriverDecisionDto } from './dto/driver-decision.dto';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

@Injectable()
export class ServiceRequestService {
    constructor(
        @InjectModel(ServiceRequest.name) private readonly serviceRequestModel: Model<ServiceRequestDocument>,
        @InjectConnection() private readonly connection: mongoose.Connection,
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

    // User assigns a driver card to request
    async assignDriverToRequest(requestId: string, assignDriverDto: AssignDriverDto): Promise<ServiceRequestDocument> {
        const { driverId, fare } = assignDriverDto;

        const request = await this.serviceRequestModel.findById(requestId);
        if (!request) {
            throw new NotFoundException('Target towing service request log entry not found.');
        }

        if (request.status !== ServiceStatus.PENDING) {
            throw new BadRequestException('Drivers can only be allocated to requests currently in PENDING state queues.');
        }

        request.driverId = new mongoose.Types.ObjectId(driverId);
        request.fare = fare;

        return await request.save();
    }

    // Fetch assigned active queues for a specific Driver screen layout map matrix
    // async getActiveRequestsForDriver(driverIdStr: string): Promise<any[]> {
    //     const driverIdObj = new mongoose.Types.ObjectId(driverIdStr);

    //     // Fetch requests filtering active statuses mapping and populate original profile names securely
    //     const activeRequests = await this.serviceRequestModel
    //         .find({
    //             driverId: driverIdObj,
    //             status: { $in: [ServiceStatus.PENDING] }
    //         })
    //         .populate('userId', 'name') // Cross-domain document references sync mapping
    //         .exec();

    //     return activeRequests.map((req) => {
    //         const reqObj = req.toObject();
    //         const populatedUser = reqObj.userId as any; // Cast populated values dynamic matching blocks

    //         return {
    //             id: reqObj.id,
    //             userName: populatedUser?.name || 'Valued Customer', // Clean transformed mapping parameter
    //             fare: reqObj.fare,
    //             vehicle: reqObj.vehicle,
    //             model: reqObj.model,
    //             problem: reqObj.problem,
    //             pickupLoc: reqObj.pickupLoc,
    //             dropoffLoc: reqObj.dropoffLoc,
    //             status: reqObj.status,
    //             createdAt: reqObj.createdAt
    //         };
    //     });
    // }

    // Handle Driver lifecycle decision mutations block inside atomic transaction contexts
    async handleDriverTripDecision(
        requestId: string,
        driverDecisionDto: DriverDecisionDto
    ): Promise<ServiceRequestDocument> {
        const { decision } = driverDecisionDto;
        const session = await this.connection.startSession();

        try {
            let updatedRequest: ServiceRequestDocument;

            await session.withTransaction(async () => {
                const request = await this.serviceRequestModel.findById(requestId).session(session);

                if (!request) {
                    throw new NotFoundException(' Towed process session trace context records not found.');
                }

                if (!request.driverId) {
                    throw new BadRequestException('Cannot evaluate operations over raw requests lacking allocated driver records.');
                }

                if (decision === 'ACCEPT') {
                    // Scenario A: Driver says YES
                    request.status = ServiceStatus.ACCEPTED;

                    // Trigger dynamic multi-collection mutation service execution inside active session
                    await this.driverService.updateDriverOnTripStatus(
                        request.driverId.toString(),
                        DutyStatus.ON_TRIP,
                        'ACCEPT',
                        session
                    );
                } else {
                    // Scenario B: Driver says NO (Reject)
                    request.status = ServiceStatus.PENDING; // Reverts back to main dynamic pool
                    const activeDriverId = request.driverId.toString();

                    request.driverId = null; // Wopes clear baseline configuration rules
                    request.fare = 0;

                    await this.driverService.updateDriverOnTripStatus(
                        activeDriverId,
                        DutyStatus.AVAILABLE,
                        'REJECT',
                        session
                    );
                }

                updatedRequest = await request.save({ session });
            });

            return updatedRequest!;
        } catch (error) {
            throw error;
        } finally {
            await session.endSession();
        }
    }
}
