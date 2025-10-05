import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { EmailProcessor } from './processors/email.processor';
import { CleanupProcessor } from './processors/cleanup.processor';
import { Session } from '../common/entities/session.entity';
import { Otp } from '../common/entities/otp.entity';
import { EmailService } from '../shared/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Otp]),
    BullModule.registerQueue({
      name: 'email',
    }),
    BullModule.registerQueue({
      name: 'cleanup',
    }),
  ],
  controllers: [QueueController],
  providers: [QueueService, EmailProcessor, CleanupProcessor, EmailService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
