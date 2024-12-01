import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiResponse } from '@nestjs/swagger';
import { HealthDto } from './Health.dto';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/')
  @ApiResponse({ type: HealthDto })
  public status() {
    return this.healthService.getApiStats();
  }
}
