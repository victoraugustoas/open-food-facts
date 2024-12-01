import { Module } from '@nestjs/common';
import { CronModule } from './external/Cron/Cron.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './external/Database/mongo.module';
import { RootEndpointModule } from './external/Endpoints/root-endpoint.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CronModule,
    MongoModule,
    RootEndpointModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
