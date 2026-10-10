import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminUserListItem } from './interfaces/admin-user-list.interface';
import { AdminDriverListItem } from './interfaces/admin-driver-list.interface';
import { AdminServiceRequestListItem } from './interfaces/admin-service-request-list.interface';
import { AdminDashboardAnalytics } from './interfaces/admin-dashboard-analytics.interface';
import { UpdateIdentityStatusDto } from '../identity/dto/update-identity-status.dto';

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

    @Get('drivers')
    async getAllDriversList(): Promise<AdminDriverListItem[]> {
        return await this.adminService.fetchAllDriversForAdmin();
    }

    @Get('service-requests')
    async getAllServiceRequestsList(): Promise<AdminServiceRequestListItem[]> {
        return await this.adminService.fetchAllServiceRequestsForAdmin();
    }

    @Get('analytics/dashboard')
    async getOverviewMetricsSummary(): Promise<AdminDashboardAnalytics> {
        return await this.adminService.fetchDashboardMetricsSummary();
    }

    @Patch('driver/:identityId/status')
    async changeDriverSystemStatus(
        @Param('identityId') identityId: string,
        @Body() updateIdentityStatusDto: UpdateIdentityStatusDto
    ): Promise<any> {
        return await this.adminService.updateDriverAccountStatus(identityId, updateIdentityStatusDto);
    }
}
