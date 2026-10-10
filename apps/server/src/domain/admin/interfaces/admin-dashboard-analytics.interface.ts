import { DriverAnalyticsStats } from 'src/domain/driver/interfaces/driver-analytics.interface';
import { ServiceRequestAnalyticsStats } from 'src/domain/service-request/interfaces/service-request-analytics.interface';
import { UserAnalyticsStats } from 'src/domain/user/interfaces/user-analytics.interface';

export interface AdminDashboardAnalytics {
    users: UserAnalyticsStats;
    drivers: DriverAnalyticsStats;
    serviceRequests: ServiceRequestAnalyticsStats;
}
