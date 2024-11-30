import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { Product, ProductProps } from '../../../domain/Product/model/Product';
import { Injectable, Logger } from '@nestjs/common';
import { CreatedDeltaFileEvent } from '../events/CreatedDeltaFile.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { ImportedFile } from '../../Database/schemas/ImportedFile.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNewProduct } from '../../../domain/Product/usecases/CreateNewProduct';
import { ProductRepository } from '../../../domain/Product/repository/Product.repository';

@Injectable()
export class ValidateAndInsertProducts {
  private readonly logger = new Logger(ValidateAndInsertProducts.name);

  constructor(
    @InjectModel(ImportedFile.name)
    private readonly importedFileModel: Model<ImportedFile>,
    private readonly productRepository: ProductRepository,
  ) {}

  @OnEvent(CreatedDeltaFileEvent.name)
  async importProducts(event: CreatedDeltaFileEvent) {
    try {
      const importedFile = await this.importedFileModel.findOne({
        _id: new mongoose.Types.ObjectId(event.importId),
      });
      if (importedFile.wasProcessed) {
        return;
      }
      this.logger.debug('Importing products...');
      const fileStream = fs.createReadStream(event.filePath, {
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

        const createNewProductUseCase = new CreateNewProduct(
          this.productRepository,
        );
        const created = await createNewProductUseCase.execute(props);
        if (created.wentWrong) {
          this.logger.error('Error in createNewProductUseCase', created.errors);
          continue;
        }
        indexLine += 1;
      }

      importedFile.wasProcessed = true;
      await importedFile.save();

      this.logger.debug(`Imported ${indexLine} products`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private toArrayIfEmpty<T>(prop: any): T[] {
    if (prop) {
      return prop.replace(', ', ',').split(',');
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
