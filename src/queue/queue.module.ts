import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'cleanup',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
