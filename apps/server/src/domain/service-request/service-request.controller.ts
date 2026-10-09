import { Body, Controller, Post } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestDocument } from './schemas/service-request.schema';

@Controller('service-request')
export class ServiceRequestController {
    constructor(private readonly serviceRequestService: ServiceRequestService) { }

    @Post()
    async createServiceCall(@Body() createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequestDocument> {
        return await this.serviceRequestService.createRequest(createServiceRequestDto);
    }
}
