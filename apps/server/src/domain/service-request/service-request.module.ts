import { Module } from '@nestjs/common';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceRequest, ServiceRequestSchema } from './schemas/service-request.schema';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ServiceRequest.name, schema: ServiceRequestSchema }]),
    DriverModule,
  ],

  providers: [ServiceRequestService],
  controllers: [ServiceRequestController],
  exports: [ServiceRequestService]
})
export class ServiceRequestModule { }
