import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CacheService } from './cache.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EmailService, CacheService],
  exports: [EmailService, CacheService],
})
export class SharedModule {}
