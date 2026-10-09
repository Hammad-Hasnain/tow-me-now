import { Body, Controller, Patch, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ToggleDutyDto } from './dto/toggle-duty.dto';
import { DriverDocument } from './schemas/driver.schema';

@Controller('driver')
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Post()
    async registerDriver(@Body() createDriverDto: CreateDriverDto) {
        return await this.driverService.createDriver(createDriverDto);
    }

    @Patch('toggle-duty')
    async updateDriverTrackingState(@Body() toggleDutyDto: ToggleDutyDto): Promise<DriverDocument> {
        return await this.driverService.updateDutyAndLocation(toggleDutyDto);
    }
}
