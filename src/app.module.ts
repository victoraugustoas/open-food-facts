import { Module } from '@nestjs/common';
import { CronModule } from './external/Cron/Cron.module';
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './external/Database/mongo.module';
import { RootEndpointModule } from './external/Endpoints/root-endpoint.module';
import { ProductsModule } from './external/Endpoints/Products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CronModule,
    MongoModule,
    RootEndpointModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
