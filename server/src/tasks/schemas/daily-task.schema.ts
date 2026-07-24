import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DailyTaskDocument = HydratedDocument<DailyTask>;

@Schema({ _id: false })
export class DailyTaskItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ enum: ['standard', 'referral'], required: true })
  kind: 'standard' | 'referral';

  @Prop({ default: false })
  done: boolean;
}

export const DailyTaskItemSchema = SchemaFactory.createForClass(DailyTaskItem);

@Schema({ timestamps: true, collection: 'daily_tasks' })
export class DailyTask {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /** YYYY-MM-DD */
  @Prop({ required: true })
  date: string;

  @Prop({ type: [DailyTaskItemSchema], default: [] })
  tasks: DailyTaskItem[];
}

export const DailyTaskSchema = SchemaFactory.createForClass(DailyTask);

DailyTaskSchema.index({ userId: 1, date: 1 }, { unique: true });
