import { Result } from 'src/domain/common/base/Result';
import {
  Product,
  ProductProps,
  ProductStatus,
} from 'src/domain/Product/model/Product';
import { ProductRepository } from '../../domain/Product/repository/Product.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as Mongo from '../Database/schemas/Product.schema';
import { VO } from '../../domain/common/base/ValueObject';
import { City } from '../../domain/Product/model/Cities';
import { MarketStore } from '../../domain/Product/model/MarketStore';
import { Category } from '../../domain/Product/model/Category';
import { Label } from '../../domain/Product/model/Label';
import { Trace } from '../../domain/Product/model/Trace';
import { MongoUnityOfWork } from '../common/implementation/MongoUnityOfWork';

@Injectable()
export class ProductMongoRepo extends ProductRepository {
  constructor(
    private productModel: Model<Mongo.Product>,
    private readonly mongoUnityOfWork: MongoUnityOfWork,
  ) {
    super();
  }

  async getByCode(code: string): Promise<Result<Product>> {
    const product = await this.productModel.findOne({ code: code }).exec();
    if (!product) {
      return Result.fail({ type: 'product_not_found', details: { code } });
    }
    return Product.new({ ...product });
  }

  async save(product: Product): Promise<Result<void>> {
    try {
      const props: ProductProps = {
        ...product.props,

        imported_t: product.props.imported_t ?? new Date(),
        status: product.status ?? ProductStatus.published,
        cities: product.cities.map(this.fromValueObjectToValue<City, string>),
        purchase_places: product.purchasePlaces.map(
          this.fromValueObjectToValue<MarketStore, string>,
        ),
        categories: product.categories.map(
          this.fromValueObjectToValue<Category, string>,
        ),
        labels: product.labels.map(this.fromValueObjectToValue<Label, string>),
        url: product.url?.value.toString(),
        traces: product.traces.map(this.fromValueObjectToValue<Trace, string>),
        image_url: product.imageUrl?.value.toString(),
      };
      const newProductDb = new this.productModel({
        ...props,
        _id: undefined,
      });
      const exists = await this.productModel.findOne({ id: product.id });
      if (exists) {
        await newProductDb.updateOne(
          { id: product.id },
          { session: this.mongoUnityOfWork.session },
        );
        return Result.ok();
      } else {
        await newProductDb.save({
          session: this.mongoUnityOfWork.session,
        });
        return Result.ok();
      }
    } catch (e) {
      return Result.fail({
        type: 'save_product_error',
        details: { error: e, product },
      });
    }
  }

  private fromValueObjectToValue<T extends VO<Y>, Y>(valueObject: T): Y {
    return valueObject.value;
  }
}
