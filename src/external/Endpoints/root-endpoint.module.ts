import { Module } from '@nestjs/common';
import { HealthModule } from './Health/health.module';

@Module({
  imports: [HealthModule],
  providers: [],
  controllers: [],
})
export class RootEndpointModule {}
