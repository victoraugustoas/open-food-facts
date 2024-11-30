import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronModule } from './external/Cron/Cron.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './external/Database/mongo.module';

@Module({
  imports: [ConfigModule.forRoot(), CronModule, MongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
