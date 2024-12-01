import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as process from 'node:process';
import { DownloadDeltaFileIndex } from '../Pipelines/pipes/DownloadDeltaFileIndex';

@Injectable()
export class ImportProductsService {
  jobName = 'import_products_cron';
  private readonly logger = new Logger(ImportProductsService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly downloadDeltaFileIndex: DownloadDeltaFileIndex,
  ) {
    this.configureCronJob();
  }

  getLastExecutionTime(): Date | null {
    const cronJob = this.schedulerRegistry.getCronJob(this.jobName);
    return cronJob.lastDate();
  }

  getNextExecutionTime(): Date {
    const cronJob = this.schedulerRegistry.getCronJob(this.jobName);
    return cronJob.nextDate().toJSDate();
  }

  private configureCronJob() {
    const cronPattern = process.env.IMPORT_PRODUCTS_CRON;

    const job = new CronJob(cronPattern, () =>
      this.downloadDeltaFileIndex.downloadDeltaFile(),
    );

    this.schedulerRegistry.addCronJob(this.jobName, job);
    job.start();

    this.logger.log(
      `job ${this.jobName} added using this cron pattern: ${cronPattern}`,
    );
  }
}
