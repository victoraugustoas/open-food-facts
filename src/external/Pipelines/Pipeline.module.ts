import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DownloadDeltaFileIndex } from './pipes/DownloadDeltaFileIndex';
import { DownloadDeltaFile } from './pipes/DownloadDeltaFile';
import { HttpModule } from '@nestjs/axios';
import { ValidateAndInsertProducts } from './pipes/ValidateAndInsertProducts';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ImportedFile,
  ImportedFileSchema,
} from '../Database/schemas/ImportedFile.schema';
import { Product, ProductSchema } from '../Database/schemas/Product.schema';
import { UnzipFile } from './pipes/UnzipFile';
import { RepositoryModule } from '../Repository/repository.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature([
      { name: ImportedFile.name, schema: ImportedFileSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    RepositoryModule,
  ],
  providers: [
    DownloadDeltaFileIndex,
    DownloadDeltaFile,
    ValidateAndInsertProducts,
    UnzipFile,
  ],
  exports: [DownloadDeltaFileIndex],
})
export class PipelineModule {}
