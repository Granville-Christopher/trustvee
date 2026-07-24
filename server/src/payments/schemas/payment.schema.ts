import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

export enum PaymentStatus {
  INITIALIZED = 'initialized',
  SUCCESS = 'success',
  FAILED = 'failed',
  ABANDONED = 'abandoned',
}

@Schema({ timestamps: true, collection: 'payments' })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Membership', required: true })
  membershipId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  reference: string;

  /** Amount in Naira */
  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'NGN' })
  currency: string;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.INITIALIZED,
  })
  status: PaymentStatus;

  @Prop({ required: true })
  packageCode: string;

  @Prop({ type: Object, default: {} })
  paystackPayload?: Record<string, unknown>;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
