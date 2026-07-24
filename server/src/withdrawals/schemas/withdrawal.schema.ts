import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WithdrawalDocument = HydratedDocument<Withdrawal>;

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export enum WithdrawalWindow {
  MONTHLY = 'monthly',
  BIWEEKLY = 'biweekly',
}

@Schema({ timestamps: true, collection: 'withdrawals' })
export class Withdrawal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 15000 })
  amount: number;

  @Prop({
    type: String,
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  @Prop({ type: String, enum: WithdrawalWindow, required: true })
  windowType: WithdrawalWindow;

  @Prop({ required: true })
  eligibleDate: Date;

  @Prop({ trim: true })
  bankName?: string;

  @Prop({ trim: true })
  accountNumber?: string;

  @Prop({ trim: true })
  accountName?: string;

  @Prop()
  processedAt?: Date;

  @Prop({ trim: true })
  note?: string;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
