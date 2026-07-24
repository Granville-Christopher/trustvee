import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true, sparse: true })
  email?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  referralCode: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  referredBy?: Types.ObjectId | null;

  @Prop({ default: 0, min: 0 })
  balance: number;

  @Prop({ default: 0, min: 0 })
  referralCount: number;

  @Prop({ default: true })
  isActive: boolean;

  /** Last date (YYYY-MM-DD) a daily claim was taken */
  @Prop()
  lastClaimDate?: string;

  @Prop({ default: 0 })
  tasksDoneToday: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phone: 1 });
UserSchema.index({ referralCode: 1 });
UserSchema.index({ referredBy: 1 });
