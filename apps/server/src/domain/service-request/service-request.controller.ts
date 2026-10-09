import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestDocument } from './schemas/service-request.schema';
import { AvailableDriverCard } from './interfaces/available-drivers-response.interface';

@Controller('service-request')
export class ServiceRequestController {
    constructor(private readonly serviceRequestService: ServiceRequestService) { }

    @Post()
    async createServiceCall(@Body() createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequestDocument> {
        return await this.serviceRequestService.createRequest(createServiceRequestDto);
    }

    @Get(':id/available-drivers')
    async fetchMatchingDriversList(@Param('id') requestId: string): Promise<AvailableDriverCard[]> {
        return await this.serviceRequestService.getCalculatedAvailableDrivers(requestId);
    }
}
