import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('cleanup') private cleanupQueue: Queue,
  ) {}

  async addWelcomeEmailJob(email: string, name: string) {
    const job = await this.emailQueue.add('welcome-email', { email, name });
    this.logger.log(`Welcome email job added: ${job.id} for ${email}`);
    return job;
  }

  async addNotificationEmailJob(email: string, subject: string, message: string) {
    const job = await this.emailQueue.add('notification-email', { email, subject, message });
    this.logger.log(`Notification email job added: ${job.id} for ${email}`);
    return job;
  }

  async addCleanupExpiredSessionsJob() {
    const job = await this.cleanupQueue.add('cleanup-expired-sessions', {});
    this.logger.log(`Cleanup expired sessions job added: ${job.id}`);
    return job;
  }

  async addCleanupExpiredOTPsJob() {
    const job = await this.cleanupQueue.add('cleanup-expired-otps', {});
    this.logger.log(`Cleanup expired OTPs job added: ${job.id}`);
    return job;
  }

  async getEmailQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.emailQueue.getWaiting(),
      this.emailQueue.getActive(),
      this.emailQueue.getCompleted(),
      this.emailQueue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async getCleanupQueueStats() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.cleanupQueue.getWaiting(),
      this.cleanupQueue.getActive(),
      this.cleanupQueue.getCompleted(),
      this.cleanupQueue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}
