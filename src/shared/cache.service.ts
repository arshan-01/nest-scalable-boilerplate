import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const defaultTtl = this.configService.get<number>('app.cache.ttl') * 1000;
      await this.cacheManager.set(key, value, ttl || defaultTtl);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async reset(): Promise<void> {
    try {
      await this.cacheManager.reset();
    } catch (error) {
      this.logger.error('Cache reset error:', error);
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number,
  ): Promise<T | undefined> {
    try {
      let value = await this.get<T>(key);
      
      if (value === undefined) {
        value = await fetchFunction();
        if (value !== undefined) {
          await this.set(key, value, ttl);
        }
      }
      
      return value;
    } catch (error) {
      this.logger.error(`Cache getOrSet error for key ${key}:`, error);
      return await fetchFunction();
    }
  }

  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const current = await this.get<number>(key) || 0;
      const newValue = current + 1;
      await this.set(key, newValue, ttl);
      return newValue;
    } catch (error) {
      this.logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  async decrement(key: string, ttl?: number): Promise<number> {
    try {
      const current = await this.get<number>(key) || 0;
      const newValue = Math.max(0, current - 1);
      await this.set(key, newValue, ttl);
      return newValue;
    } catch (error) {
      this.logger.error(`Cache decrement error for key ${key}:`, error);
      return 0;
    }
  }
}
