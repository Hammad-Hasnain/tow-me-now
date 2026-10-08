import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentityModule } from '../identity/identity.module';
import { Driver, DriverSchema } from './schemas/driver.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    IdentityModule,
  ],
  providers: [DriverService],
  controllers: [DriverController]
})
export class DriverModule { }
