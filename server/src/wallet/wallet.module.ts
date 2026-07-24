import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './schemas/wallet-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class WalletModule {}
