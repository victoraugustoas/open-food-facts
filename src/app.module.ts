import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './external/Cron/Cron.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CronModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
