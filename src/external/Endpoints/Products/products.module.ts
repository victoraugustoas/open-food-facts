import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { MongoModule } from '../../Database/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
