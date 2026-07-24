import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReferralDocument = HydratedDocument<Referral>;

@Schema({ timestamps: true, collection: 'referrals' })
export class Referral {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  referrerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  refereeId: Types.ObjectId;

  @Prop({ required: true })
  packageCode: string;

  @Prop({ required: true })
  packageEntryAmount: number;

  /** 10% of package entry */
  @Prop({ required: true })
  bonusAmount: number;

  @Prop({ default: false })
  bonusPaid: boolean;

  @Prop()
  paidAt?: Date;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
