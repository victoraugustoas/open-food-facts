import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as process from 'node:process';
import { DownloadDeltaFileIndex } from '../Pipelines/pipes/DownloadDeltaFileIndex';

@Injectable()
export class ImportProductsService {
  private readonly logger = new Logger(ImportProductsService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly downloadDeltaFileIndex: DownloadDeltaFileIndex,
  ) {
    this.configureCronJob();
  }

  private configureCronJob() {
    const jobName = 'import_products_cron';
    const cronPattern = process.env.IMPORT_PRODUCTS_CRON;

    const job = new CronJob(cronPattern, () =>
      this.downloadDeltaFileIndex.downloadDeltaFile(),
    );

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(
      `job ${jobName} added using this cron pattern: ${cronPattern}`,
    );
  }
}
