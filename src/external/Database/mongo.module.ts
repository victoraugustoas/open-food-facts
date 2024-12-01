import { Module } from '@nestjs/common';
import * as process from 'node:process';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  ImportedFile,
  ImportedFileSchema,
} from './schemas/ImportedFile.schema';
import { Product, ProductSchema } from './schemas/Product.schema';

const mongooseFeatures: ModelDefinition[] = [
  { name: ImportedFile.name, schema: ImportedFileSchema },
  { name: Product.name, schema: ProductSchema },
];

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL),
    MongooseModule.forFeature(mongooseFeatures),
  ],
  exports: [MongooseModule.forFeature(mongooseFeatures)],
})
export class MongoModule {}
