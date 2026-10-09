import { Module, forwardRef } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './schemas/identity.schema';
import { IdentityController } from './identity.controller';
import { UserModule } from '../user/user.module';
import { DriverModule } from '../driver/driver.module';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';


interface EnvironmentVariables {
  JWT_SECRET: string;
  JWT_EXPIRATION: SignOptions['expiresIn'];
}

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Identity.name, schema: IdentitySchema }]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION', { infer: true }),
        },
      }),
    }),

    forwardRef(() => UserModule),
    forwardRef(() => DriverModule),
    forwardRef(() => AdminModule),
  ],

  providers: [IdentityService],
  exports: [IdentityService],
  controllers: [IdentityController],
})
export class IdentityModule { }
