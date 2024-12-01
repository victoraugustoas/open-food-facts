import { Module } from '@nestjs/common';
import { ImportProductsService } from './ImportProducts.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PipelineModule } from '../Pipelines/Pipeline.module';

@Module({
  imports: [ScheduleModule.forRoot(), PipelineModule],
  providers: [ImportProductsService],
  exports: [ImportProductsService],
})
export class CronModule {}
