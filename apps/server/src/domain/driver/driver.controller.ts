import { Body, Controller, Post } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('driver')
export class DriverController {
    constructor(private readonly driverService: DriverService) { }

    @Post()
    async registerDriver(@Body() createDriverDto: CreateDriverDto) {
        return await this.driverService.createDriver(createDriverDto);
    }
}
