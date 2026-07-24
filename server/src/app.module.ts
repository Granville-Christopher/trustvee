import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { MembershipsModule } from './memberships/memberships.module';
import { PackagesModule } from './packages/packages.module';
import { PaymentsModule } from './payments/payments.module';
import { ReferralsModule } from './referrals/referrals.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri:
          config.get<string>('MONGODB_URI') ??
          'mongodb://127.0.0.1:27017/trustvee',
      }),
    }),
    HealthModule,
    PackagesModule,
    UsersModule,
    MembershipsModule,
    WalletModule,
    TasksModule,
    ReferralsModule,
    WithdrawalsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
