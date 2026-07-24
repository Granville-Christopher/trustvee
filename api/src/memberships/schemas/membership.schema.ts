import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MembershipDocument = HydratedDocument<Membership>;

export enum MembershipStatus {
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true, collection: 'memberships' })
export class Membership {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Package', required: true })
  packageId: Types.ObjectId;

  @Prop({ required: true })
  packageCode: string;

  @Prop({ required: true })
  entryAmount: number;

  @Prop({ required: true })
  returnAmount: number;

  @Prop({ default: false })
  isElite: boolean;

  @Prop({
    type: String,
    enum: MembershipStatus,
    default: MembershipStatus.PENDING_PAYMENT,
  })
  status: MembershipStatus;

  /** Set when Paystack payment confirms */
  @Prop()
  paidAt?: Date;

  @Prop()
  cycleStartedAt?: Date;

  /** paidAt + 30 days */
  @Prop()
  cycleEndsAt?: Date;

  @Prop()
  paystackReference?: string;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);

MembershipSchema.index({ userId: 1, status: 1 });
MembershipSchema.index({ paystackReference: 1 }, { sparse: true, unique: true });
