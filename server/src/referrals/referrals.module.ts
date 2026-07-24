import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Referral, ReferralSchema } from './schemas/referral.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Referral.name, schema: ReferralSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ReferralsModule {}
