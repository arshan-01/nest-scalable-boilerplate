import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../common/entities/session.entity';
import { Otp } from '../../common/entities/otp.entity';

@Processor('cleanup')
export class CleanupProcessor {
  private readonly logger = new Logger(CleanupProcessor.name);

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  @Process('cleanup-expired-sessions')
  async handleCleanupExpiredSessions(job: Job) {
    this.logger.log(`Processing cleanup expired sessions job ${job.id}`);

    try {
      const result = await this.sessionRepository
        .createQueryBuilder()
        .delete()
        .where('expiresAt < :now', { now: new Date() })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} expired sessions`);
    } catch (error) {
      this.logger.error(`Failed to cleanup expired sessions: ${error.message}`);
      throw error;
    }
  }

  @Process('cleanup-expired-otps')
  async handleCleanupExpiredOTPs(job: Job) {
    this.logger.log(`Processing cleanup expired OTPs job ${job.id}`);

    try {
      const result = await this.otpRepository
        .createQueryBuilder()
        .delete()
        .where('expiresAt < :now', { now: new Date() })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} expired OTPs`);
    } catch (error) {
      this.logger.error(`Failed to cleanup expired OTPs: ${error.message}`);
      throw error;
    }
  }
}
