import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('hello')
  @CacheTTL(30000) // 30 seconds
  getHello(): string {
    console.log('Fetching hello from service (not cache)...');
    return this.appService.getHello();
  }
}
