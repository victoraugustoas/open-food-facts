import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import * as process from 'node:process';
import { Product, ProductProps } from '../../domain/Product/model/Product';

@Injectable()
export class ImportProductsService {
  private readonly logger = new Logger(ImportProductsService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {
    this.configureCronJob();
  }

  toArrayIfEmpty<T>(prop: any): T[] {
    if (prop) {
      return prop.split(',');
    } else {
      return [];
    }
  }

  toUndefinedIfEmpty<T>(prop: any): T {
    return !!prop ? prop : undefined;
  }

  normalizeProduct(objectProduct: { [key: string]: any }): ProductProps {
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

  configureCronJob() {
    const jobName = 'import_products_cron';
    const cronPattern = process.env.IMPORT_PRODUCTS_CRON;

    const job = new CronJob(cronPattern, () => this.importProducts());

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();

    this.logger.log(
      `job ${jobName} added using this cron pattern: ${cronPattern}`,
    );
  }
}
