import * as fs from 'node:fs';
import { firstValueFrom } from 'rxjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DownloadDeltaFileEvent } from '../events/DownloadDeltaFile.event';
import { UnzipFileEvent } from '../events/UnzipFile.event';

@Injectable()
export class DownloadDeltaFile {
  private readonly logger = new Logger(DownloadDeltaFile.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly httpService: HttpService,
  ) {}

  @OnEvent(DownloadDeltaFileEvent.name)
  async downloadDeltaFile(event: DownloadDeltaFileEvent) {
    try {
      const filename = event.fileName;
      const exists = fs.existsSync(this.downloadPath(filename));
      if (exists) {
        this.eventEmitter.emit(
          UnzipFileEvent.name,
          new UnzipFileEvent(this.downloadPath(filename), event.importId),
        );
        return;
      }
      this.logger.debug(`Downloading ${filename}...`);

      const fileStream = fs.createWriteStream(this.downloadPath(filename), {
        flags: 'w',
      });
      const request = await firstValueFrom(
        this.httpService.get(this.urlDownloadFile(filename), {
          responseType: 'stream',
        }),
      );
      const writeFile = await new Promise((resolve, reject) => {
        request.data.pipe(fileStream);
        let error = null;
        fileStream.on('error', (err) => {
          error = err;
          fileStream.close();
          reject(err);
        });
        fileStream.on('close', () => {
          if (!error) {
            resolve(true);
          }
        });
      });
      if (writeFile) {
        this.logger.debug(`Downloaded ${filename}`);
        this.eventEmitter.emit(
          UnzipFileEvent.name,
          new UnzipFileEvent(this.downloadPath(filename), event.importId),
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private urlDownloadFile(fileName: string) {
    return `${process.env.URL_DELTA_FILE_DOWNLOAD}/${fileName}`;
  }

  private downloadPath(fileName: string) {
    return `${process.env.DOWNLOAD_DELTA_FILE_PATH}/${fileName}`;
  }
}
