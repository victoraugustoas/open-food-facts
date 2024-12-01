import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DownloadDeltaFileIndex } from './pipes/DownloadDeltaFileIndex';
import { DownloadDeltaFile } from './pipes/DownloadDeltaFile';
import { HttpModule } from '@nestjs/axios';
import { ValidateAndInsertProducts } from './pipes/ValidateAndInsertProducts';
import { UnzipFile } from './pipes/UnzipFile';
import { MongoModule } from '../Database/mongo.module';

@Module({
  imports: [EventEmitterModule.forRoot(), HttpModule, MongoModule],
  providers: [
    DownloadDeltaFileIndex,
    DownloadDeltaFile,
    ValidateAndInsertProducts,
    UnzipFile,
  ],
  exports: [DownloadDeltaFileIndex],
})
export class PipelineModule {}
