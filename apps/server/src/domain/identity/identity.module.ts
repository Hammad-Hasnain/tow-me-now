import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Identity, IdentitySchema } from './schemas/identity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Identity.name, schema: IdentitySchema }]),
  ],

  providers: [IdentityService]
})
export class IdentityModule { }
