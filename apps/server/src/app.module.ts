import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './domain/identity/identity.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './domain/user/user.module';
import { DriverModule } from './domain/driver/driver.module';
import { ServiceRequestModule } from './domain/service-request/service-request.module';
import { AdminModule } from './domain/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    IdentityModule,

    UserModule,

    DriverModule,

    ServiceRequestModule,

    AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
