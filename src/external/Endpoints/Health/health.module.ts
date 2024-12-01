import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { CronModule } from '../../Cron/Cron.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [CronModule, TerminusModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
