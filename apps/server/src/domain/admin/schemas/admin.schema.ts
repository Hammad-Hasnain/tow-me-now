import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ required: true, trim: true, index: true })
    name!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Identity', required: true, unique: true, index: true })
    identityId!: mongoose.Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});