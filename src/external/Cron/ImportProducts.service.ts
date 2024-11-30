import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import * as process from 'node:process';
import { Product, ProductProps } from '../../domain/Product/model/Product';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { promisify } from 'node:util';
import * as child_process from 'node:child_process';

const execAsync = promisify(child_process.exec);

@Injectable()
export class ImportProductsService {
  private readonly logger = new Logger(ImportProductsService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
  ) {
    this.configureCronJob();
  }

  async importProducts() {
    this.logger.debug('Importing products...');
    try {
      const fileStream = fs.createReadStream('/tmp/products_01.json', {
        flags: 'r',
        encoding: 'utf-8',
      });
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      const totalLines = Number(process.env.ITEMS_TO_IMPORT_PER_FILE);
      let indexLine = 0;
      for await (const line of rl) {
        if (indexLine > totalLines) break;
        const parseLine = JSON.parse(line);
        const props = this.normalizeProduct(parseLine);
        const product = Product.new(props);

        if (product.wentWrong) {
          // TODO track error for file
          continue;
        }
        indexLine += 1;
      }
      this.logger.debug(`Imported ${indexLine} products`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async downloadDeltaFile(filename: string) {
    try {
      this.logger.debug(`Downloading ${filename}...`);
      const downloadPath = () =>
        `${process.env.DOWNLOAD_DELTA_FILE_PATH}/${filename}`;
      const urlDownloadFile = () =>
        `${process.env.URL_DELTA_FILE_DOWNLOAD}/${filename}`;

      const fileStream = fs.createWriteStream(downloadPath(), {
        flags: 'w',
        encoding: 'utf8',
      });
      const request = await firstValueFrom(
        this.httpService.get(urlDownloadFile(), { responseType: 'stream' }),
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
        this.logger.debug(`Starting decompress file: ${filename}`);
        await execAsync(`gzip -dk ${downloadPath()}`);
        this.logger.debug(`Decompressed ${downloadPath()}`);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async downloadDeltaFiles() {
    try {
      const deltaFiles = await firstValueFrom(
        this.httpService.get(process.env.URL_DELTA_INDEX),
      );
      const files: string[] = deltaFiles.data
        .split('\n')
        .filter((x: string) => x !== '');
      this.logger.debug(`Delta Files in index: ${files}`);
      for (const file of files) {
        await this.downloadDeltaFile(file);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private configureCronJob() {
    const jobName = 'import_products_cron';
    const cronPattern = process.env.IMPORT_PRODUCTS_CRON;

    const job = new CronJob(cronPattern, () => this.downloadDeltaFiles());

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(
      `job ${jobName} added using this cron pattern: ${cronPattern}`,
    );
  }

  private toArrayIfEmpty<T>(prop: any): T[] {
    if (prop) {
      return prop.split(',');
    } else {
      return [];
    }
  }

  private toUndefinedIfEmpty<T>(prop: any): T {
    return !!prop ? prop : undefined;
  }

  private normalizeProduct(objectProduct: {
    [key: string]: any;
  }): ProductProps {
    return {
      ...(objectProduct as ProductProps),
      image_url: this.toUndefinedIfEmpty(objectProduct.image_url),
      categories: this.toArrayIfEmpty(objectProduct['categories']),
      labels: this.toArrayIfEmpty(objectProduct['labels']),
      cities: this.toArrayIfEmpty(objectProduct['cities']),
      purchase_places: this.toArrayIfEmpty(objectProduct['purchase_places']),
      ingredients_text: this.toArrayIfEmpty(objectProduct['ingredients_text']),
      traces: this.toArrayIfEmpty(objectProduct['traces']),
    };
  }
}
