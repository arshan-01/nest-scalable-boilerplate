import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/entities/user.entity';

@ApiTags('queue')
@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post('email/send-welcome')
  @ApiOperation({ summary: 'Queue welcome email job' })
  @ApiResponse({ status: 201, description: 'Welcome email job queued successfully' })
  async queueWelcomeEmail(@Body() data: { email: string; name: string }) {
    const job = await this.queueService.addWelcomeEmailJob(data.email, data.name);
    return {
      success: true,
      message: 'Welcome email job queued successfully',
      data: { jobId: job.id },
    };
  }

  @Post('email/send-notification')
  @ApiOperation({ summary: 'Queue notification email job' })
  @ApiResponse({ status: 201, description: 'Notification email job queued successfully' })
  async queueNotificationEmail(@Body() data: { email: string; subject: string; message: string }) {
    const job = await this.queueService.addNotificationEmailJob(data.email, data.subject, data.message);
    return {
      success: true,
      message: 'Notification email job queued successfully',
      data: { jobId: job.id },
    };
  }

  @Post('cleanup/expired-sessions')
  @ApiOperation({ summary: 'Queue cleanup expired sessions job' })
  @ApiResponse({ status: 201, description: 'Cleanup job queued successfully' })
  async queueCleanupExpiredSessions() {
    const job = await this.queueService.addCleanupExpiredSessionsJob();
    return {
      success: true,
      message: 'Cleanup expired sessions job queued successfully',
      data: { jobId: job.id },
    };
  }

  @Post('cleanup/expired-otps')
  @ApiOperation({ summary: 'Queue cleanup expired OTPs job' })
  @ApiResponse({ status: 201, description: 'Cleanup job queued successfully' })
  async queueCleanupExpiredOTPs() {
    const job = await this.queueService.addCleanupExpiredOTPsJob();
    return {
      success: true,
      message: 'Cleanup expired OTPs job queued successfully',
      data: { jobId: job.id },
    };
  }
}
