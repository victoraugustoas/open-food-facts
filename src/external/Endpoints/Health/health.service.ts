import { Injectable } from '@nestjs/common';
import { ImportProductsService } from '../../Cron/ImportProducts.service';
import { bytesToSize } from '../../common/utils/bytesToSize';
import { formatDuration, intervalToDuration } from 'date-fns';
import { MongooseHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
  initializeTime = new Date();

  constructor(
    private readonly importProductsService: ImportProductsService,
    private readonly mongoDb: MongooseHealthIndicator,
  ) {}

  async getApiStats() {
    const memoryRss = this.getProfileMemory();
    return {
      cron: {
        lastExecutionTime: this.importProductsService.getLastExecutionTime(),
        nextExecutionTime: this.importProductsService.getNextExecutionTime(),
      },
      uptime: {
        uptimeSeconds:
          (new Date().getTime() - this.initializeTime.getTime()) / 1000,
        uptimeHuman: formatDuration(
          intervalToDuration({
            start: this.initializeTime,
            end: new Date(),
          }),
          { delimiter: ', ' },
        ),
      },
      memory: { rssBytes: memoryRss, rssHuman: bytesToSize(memoryRss) },
      ...(await this.getMongooseHealthIndicator()),
    };
  }

  private async getMongooseHealthIndicator() {
    return this.mongoDb.pingCheck('mongodb');
  }

  private getProfileMemory() {
    // https://nodejs.org/api/process.html#process_process_memoryusage
    return process.memoryUsage.rss();
  }
}
