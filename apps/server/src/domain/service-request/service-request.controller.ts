import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { ServiceRequestDocument } from './schemas/service-request.schema';
import { AvailableDriverCard } from './interfaces/available-drivers-response.interface';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { DriverDecisionDto } from './dto/driver-decision.dto';
import { EnRouteDetailsResponse } from './interfaces/en-route-details.interface';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';

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

    @Patch(':id/assign')
    async assignSelectedDriver(
        @Param('id') requestId: string,
        @Body() assignDriverDto: AssignDriverDto
    ): Promise<ServiceRequestDocument> {
        return await this.serviceRequestService.assignDriverToRequest(requestId, assignDriverDto);
    }

    @Get('driver/:driverId')
    async fetchDriverJobQueue(@Param('driverId') driverId: string): Promise<any[]> {
        return await this.serviceRequestService.getActiveRequestsForDriver(driverId);
    }

    @Patch(':id/decision')
    async processDriverTripAction(
        @Param('id') requestId: string,
        @Body() driverDecisionDto: DriverDecisionDto
    ): Promise<ServiceRequestDocument> {
        return await this.serviceRequestService.handleDriverTripDecision(requestId, driverDecisionDto);
    }

    @Get(':id/en-route')
    async fetchActiveTrackingMetadata(@Param('id') requestId: string): Promise<EnRouteDetailsResponse> {
        return await this.serviceRequestService.getEnRouteDetails(requestId);
    }

    @Patch(':id/status')
    async changeTripStateProgress(
        @Param('id') requestId: string,
        @Body() updateServiceStatusDto: UpdateServiceStatusDto
    ): Promise<ServiceRequestDocument> {
        return await this.serviceRequestService.updateTripLifecycleStatus(requestId, updateServiceStatusDto);
    }
}
