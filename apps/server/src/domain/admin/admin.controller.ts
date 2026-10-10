import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminUserListItem } from './interfaces/admin-user-list.interface';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post()
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return await this.adminService.createAdmin(createAdminDto);
    }

    @Get('users')
    async getAllUsersList(): Promise<AdminUserListItem[]> {
        return await this.adminService.fetchAllUsersForAdmin();
    }
}
