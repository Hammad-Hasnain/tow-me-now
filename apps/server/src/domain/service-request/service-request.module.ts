import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';

@Module({
  providers: [ServiceRequestService],
  controllers: [ServiceRequestController]
})
export class ServiceRequestModule {}
