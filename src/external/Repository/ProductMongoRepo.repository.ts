import { Result } from 'src/domain/common/base/Result';
import { Product } from 'src/domain/Product/model/Product';
import { ProductRepository } from '../../domain/Product/repository/Product.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Mongo from '../Database/schemas/Product.schema';
import { VO } from '../../domain/common/base/ValueObject';

@Injectable()
export class ProductMongoRepo extends ProductRepository {
  constructor(
    @InjectModel(Mongo.Product.name)
    private importedFileModel: Model<Mongo.Product>,
  ) {
    super();
  }

  getByCode(code: string): Promise<Result<number>> {
    throw new Error('Method not implemented.');
  }

  delete(product: Product): Promise<Result<void>> {
    throw new Error('Method not implemented.');
  }

  async save(product: Product): Promise<Result<void>> {
    const newProductDb = new this.importedFileModel({
      ...product.props,
      cities: product.cities,
      purchase_places: product.purchasePlaces.map(this.fromValueObjectToValue),
      categories: product.categories.map(this.fromValueObjectToValue),
      labels: product.labels.map(this.fromValueObjectToValue),
      url: product.url.value,
      traces: product.traces.map(this.fromValueObjectToValue),
      image_url: product.imageUrl.value,
      ingredients_text: product.ingredients.map(this.fromValueObjectToValue),
      id: product.id.id,
    });
    await newProductDb.save();
    return Result.ok();
  }

  private fromValueObjectToValue<T extends VO<Y>, Y>(valueObject: T): Y {
    return valueObject.value;
  }
}
