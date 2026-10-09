import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ _id: false })
class CurrentLocation {
    @Prop({ type: Number, default: null })
    latitude!: number | null;

    @Prop({ type: Number, default: null })
    longitude!: number | null;

    @Prop({ type: String, default: null, trim: true })
    address!: string | null;
}

@Schema({ timestamps: true })
export class Driver {
    @Prop({ required: true, trim: true, index: true })
    name!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Identity', required: true, unique: true, index: true })
    identityId!: mongoose.Types.ObjectId;

    @Prop({ required: true, type: String, enum: VehicleType, index: true })
    vehicleType!: VehicleType;

    @Prop({ required: true, trim: true, uppercase: true })
    vehicleNumber!: string;

    @Prop({ type: String, default: null, trim: true })
    cnic!: string | null;

    @Prop({ type: String, default: null, trim: true })
    license!: string | null;

    @Prop({ type: String, default: null, trim: true })
    vehiclePaper!: string | null;

    @Prop({ type: String, default: null, trim: true })
    profile!: string | null;

    @Prop({ type: Number, default: 0 })
    earnings!: number;

    @Prop({ type: Number, default: 0 })
    serviceReqAcc!: number;

    @Prop({ type: Number, default: 0 })
    serviceReqRej!: number;

    @Prop({ required: true, type: String, enum: DutyStatus, default: DutyStatus.OFFLINE, index: true })
    dutyStatus!: DutyStatus;

    @Prop({ type: CurrentLocation, default: () => ({ latitude: null, longitude: null, address: null }) })
    currentLocation!: CurrentLocation;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});