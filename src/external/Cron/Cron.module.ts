import { Module } from '@nestjs/common';
import { ImportProductsService } from './ImportProducts.service';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  providers: [ImportProductsService],
  exports: [],
})
export class CronModule {}
