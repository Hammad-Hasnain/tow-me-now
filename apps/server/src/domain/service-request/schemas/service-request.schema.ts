import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ServiceStatus } from 'src/shared/enums/service-status.enum';

export type ServiceRequestDocument = HydratedDocument<ServiceRequest>;

@Schema({ _id: false })
class CoordinateLocation {
    @Prop({ required: true, type: Number })
    latitude!: number;

    @Prop({ required: true, type: Number })
    longitude!: number;

    @Prop({ required: true, type: String, trim: true })
    address!: string;
}

@Schema({ timestamps: true, collection: 'service_requests' })
export class ServiceRequest {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
    userId!: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null, index: true })
    driverId!: mongoose.Types.ObjectId | null;

    @Prop({ required: true, trim: true })
    vehicle!: string;

    @Prop({ required: true, trim: true })
    model!: string;

    @Prop({ required: true, trim: true })
    problem!: string;

    @Prop({ type: CoordinateLocation, required: true })
    pickupLoc!: CoordinateLocation;

    @Prop({ type: CoordinateLocation, required: true })
    dropoffLoc!: CoordinateLocation;

    @Prop({ type: Number, default: 0 })
    fare!: number;

    @Prop({ required: true, type: String, enum: ServiceStatus, default: ServiceStatus.PENDING, index: true })
    status!: ServiceStatus;
}

export const ServiceRequestSchema = SchemaFactory.createForClass(ServiceRequest);

ServiceRequestSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});