import { Module } from '@nestjs/common';
import { ProductRepository } from '../../domain/Product/repository/Product.repository';
import { ProductMongoRepo } from './ProductMongoRepo.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../Database/schemas/Product.schema';

const providers = [{ provide: ProductRepository, useClass: ProductMongoRepo }];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: providers,
  exports: providers,
})
export class RepositoryModule {}
