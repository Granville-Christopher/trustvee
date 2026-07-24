import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdrawal, WithdrawalSchema } from './schemas/withdrawal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Withdrawal.name, schema: WithdrawalSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WithdrawalsModule {}
