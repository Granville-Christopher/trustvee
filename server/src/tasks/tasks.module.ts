import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyTask, DailyTaskSchema } from './schemas/daily-task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyTask.name, schema: DailyTaskSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TasksModule {}
