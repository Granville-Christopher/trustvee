import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletTransactionDocument = HydratedDocument<WalletTransaction>;

export enum WalletTxType {
  DEPOSIT = 'deposit',
  DAILY_CLAIM = 'daily_claim',
  REFERRAL_BONUS = 'referral_bonus',
  WITHDRAWAL = 'withdrawal',
  ADJUSTMENT = 'adjustment',
}

@Schema({ timestamps: true, collection: 'wallet_transactions' })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: WalletTxType, required: true })
  type: WalletTxType;

  /** Positive = credit, negative = debit */
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  balanceAfter: number;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: Object, default: {} })
  meta?: Record<string, unknown>;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
