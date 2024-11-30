import { UnzipFileEvent } from '../events/UnzipFile.event';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { promisify } from 'node:util';
import * as child_process from 'node:child_process';
import { CreatedDeltaFileEvent } from '../events/CreatedDeltaFile.event';
import * as fs from 'node:fs';

const execAsync = promisify(child_process.exec);

@Injectable()
export class UnzipFile {
  private readonly logger = new Logger(UnzipFile.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @OnEvent(UnzipFileEvent.name)
  async decompress(event: UnzipFileEvent) {
    try {
      const jsonFilePath = event.filePath.replace('.gz', '');
      const existsFile = fs.existsSync(jsonFilePath);
      if (!existsFile) {
        this.logger.debug(`Starting decompress file: ${event.filePath}`);
        await execAsync(`gzip -dk ${event.filePath}`);
        this.logger.debug(`Decompressed ${event.filePath}`);
      }
      this.eventEmitter.emit(
        CreatedDeltaFileEvent.name,
        new CreatedDeltaFileEvent(jsonFilePath, event.importId),
      );
    } catch (e) {
      this.logger.error(e);
    }
  }
}
