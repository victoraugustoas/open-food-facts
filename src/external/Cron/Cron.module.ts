import { Module } from '@nestjs/common';
import { ImportProductsService } from './ImportProducts.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ImportProductsService],
  exports: [ImportProductsService],
})
export class CronModule {}
