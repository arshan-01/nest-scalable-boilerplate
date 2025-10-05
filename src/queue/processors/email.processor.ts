import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailService } from '../../shared/email.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly emailService: EmailService) {}

  @Process('welcome-email')
  async handleWelcomeEmail(job: Job<{ email: string; name: string }>) {
    this.logger.log(`Processing welcome email job ${job.id}`);

    try {
      const { email, name } = job.data;
      await this.emailService.sendWelcomeEmail(email, name);
      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email: ${error.message}`);
      throw error;
    }
  }

  @Process('notification-email')
  async handleNotificationEmail(job: Job<{ email: string; subject: string; message: string }>) {
    this.logger.log(`Processing notification email job ${job.id}`);

    try {
      const { email, subject, message } = job.data;
      // You can create a generic notification email method in EmailService
      this.logger.log(`Notification email would be sent to ${email}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send notification email: ${error.message}`);
      throw error;
    }
  }
}
