import { EventEmitter2 } from '@nestjs/event-emitter';
import { firstValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ImportedFile } from '../../Database/schemas/ImportedFile.schema';
import { DownloadDeltaFileEvent } from '../events/DownloadDeltaFile.event';

@Injectable()
export class DownloadDeltaFileIndex {
  private readonly logger = new Logger(DownloadDeltaFileIndex.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
    @InjectModel(ImportedFile.name)
    private importedFileModel: Model<ImportedFile>,
  ) {}

  async downloadDeltaFile() {
    try {
      const deltaFiles = await firstValueFrom(
        this.httpService.get(process.env.URL_DELTA_INDEX),
      );
      const files: string[] = deltaFiles.data
        .split('\n')
        .filter((x: string) => x !== '');
      this.logger.debug(`Delta Files in index: ${files}`);
      for (const file of files) {
        const exists = await this.importedFileModel
          .findOne({ fileName: file })
          .exec();
        let importId = exists ? exists._id : null;
        if (!exists) {
          const importedFile = new this.importedFileModel({
            fileName: file,
            wasProcessed: false,
          });
          await importedFile.save();
          importId = importedFile.id;
        }

        this.eventEmitter.emit(
          DownloadDeltaFileEvent.name,
          new DownloadDeltaFileEvent(file, importId.toString()),
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
