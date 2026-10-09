import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ServiceRequest, ServiceRequestDocument } from './schemas/service-request.schema';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';

@Injectable()
export class ServiceRequestService {
    constructor(
        @InjectModel(ServiceRequest.name) private readonly serviceRequestModel: Model<ServiceRequestDocument>,
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
}
