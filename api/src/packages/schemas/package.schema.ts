import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PackageDocument = HydratedDocument<Package>;

@Schema({ timestamps: true, collection: 'packages' })
export class Package {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  /** Entry fee in Naira */
  @Prop({ required: true, min: 0 })
  entryAmount: number;

  /** Month-end return in Naira */
  @Prop({ required: true, min: 0 })
  returnAmount: number;

  /** Elite / Prestige / Apex → bi-weekly withdrawals */
  @Prop({ default: false })
  isElite: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

PackageSchema.virtual('dailyClaim').get(function (this: Package) {
  return Math.floor(this.returnAmount / 30);
});
