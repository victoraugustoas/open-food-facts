import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { ProductProps } from '../../../domain/Product/model/Product';
import { Injectable, Logger } from '@nestjs/common';
import { CreatedDeltaFileEvent } from '../events/CreatedDeltaFile.event';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ImportedFile } from '../../Database/schemas/ImportedFile.schema';
import mongoose, { Model } from 'mongoose';
import { CreateNewProduct } from '../../../domain/Product/usecases/CreateNewProduct';
import { MongoUnityOfWork } from '../../common/implementation/MongoUnityOfWork';
import { ProductMongoRepo } from '../../Repository/ProductMongoRepo.repository';
import * as Mongo from '../../Database/schemas/Product.schema';

@Injectable()
export class ValidateAndInsertProducts {
  private readonly logger = new Logger(ValidateAndInsertProducts.name);

  constructor(
    @InjectModel(ImportedFile.name)
    private readonly importedFileModel: Model<ImportedFile>,
    @InjectModel(Mongo.Product.name)
    private productModel: Model<Mongo.Product>,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  @OnEvent(CreatedDeltaFileEvent.name)
  async importProducts(event: CreatedDeltaFileEvent) {
    const unityOfWork = new MongoUnityOfWork(this.connection);
    const productRepository = new ProductMongoRepo(
      this.productModel,
      unityOfWork,
    );
    try {
      await unityOfWork.begin();
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
        indexLine += 1;

        const parseLine = JSON.parse(line);
        const props = this.normalizeProduct(parseLine);

        const createNewProductUseCase = new CreateNewProduct(productRepository);
        const created = await createNewProductUseCase.execute(props);
        if (created.wentWrong) {
          this.logger.error('Error in createNewProductUseCase', created.errors);
        }
        if (indexLine >= totalLines) break;
      }

      importedFile.wasProcessed = true;
      await importedFile.save({ session: unityOfWork.session });

      await unityOfWork.commit();
      this.logger.debug(`Imported ${indexLine} products`);
    } catch (e) {
      await unityOfWork.rollback();
      this.logger.error(e);
    }
  }

  private toArrayIfEmpty<T>(prop: any): T[] {
    if (prop) {
      return prop.replaceAll(', ', ',').split(',');
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
      traces: this.toArrayIfEmpty(objectProduct['traces']),
    };
  }
}
