import { ProductRepository } from '../../domain/Product/repository/Product.repository';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as Mongo from '../Database/schemas/Product.schema';
import { ProductDocument } from '../Database/schemas/Product.schema';
import { VO } from '../../domain/common/base/ValueObject';
import { City } from '../../domain/Product/model/Cities';
import { MarketStore } from '../../domain/Product/model/MarketStore';
import { Category } from '../../domain/Product/model/Category';
import { Label } from '../../domain/Product/model/Label';
import { Trace } from '../../domain/Product/model/Trace';
import { MongoUnityOfWork } from '../common/implementation/MongoUnityOfWork';
import { Result } from '../../domain/common/base/Result';
import {
  Product,
  ProductProps,
  ProductStatus,
} from '../../domain/Product/model/Product';

@Injectable()
export class ProductMongoRepo extends ProductRepository {
  constructor(
    private productModel: Model<Mongo.Product>,
    private readonly mongoUnityOfWork: MongoUnityOfWork,
  ) {
    super();
  }

  async getProducts(
    page: number,
    limit: number,
  ): Promise<Result<{ products: Product[]; total: number }>> {
    const total = await this.productModel
      .countDocuments(
        { status: ProductStatus.published },
        { session: this.mongoUnityOfWork.session },
      )
      .exec();
    const results = await this.productModel
      .find({ status: ProductStatus.published }, undefined, {
        limit,
        skip: page * limit,
        session: this.mongoUnityOfWork.session,
      })
      .exec();
    const productsProps = results.map((doc) =>
      Product.new(this.mapDocToProductProps(doc)),
    );
    const products = Result.combine(productsProps);
    if (products.wentWrong) return products.asFail;

    return Result.ok({ products: products.instance, total });
  }

  async getByCode(code: string): Promise<Result<Product>> {
    const product = await this.productModel
      .findOne({ code: code }, undefined, {
        session: this.mongoUnityOfWork.session,
      })
      .exec();
    if (!product) {
      return Result.fail({ type: 'product_not_found', details: { code } });
    }

    return Product.new(this.mapDocToProductProps(product));
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
      const exists = await this.productModel.findOne(
        { id: product.id },
        undefined,
        { session: this.mongoUnityOfWork.session },
      );
      if (exists) {
        await this.productModel
          .updateOne(
            { id: product.id },
            { ...props, _id: undefined },
            {
              session: this.mongoUnityOfWork.session,
            },
          )
          .exec();
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

  private mapDocToProductProps(document: ProductDocument): ProductProps {
    return {
      code: document.code,
      categories: document.categories,
      labels: document.labels,
      cities: document.cities,
      purchase_places: document.purchase_places,
      traces: document.traces,
      image_url: document.image_url,
      product_name: document.product_name,
      status: document.status,
      url: document.url,
      created_t: document.created_t,
      last_modified_t: document.last_modified_t,
      ingredients_text: document.ingredients_text,
      id: document.id,
      imported_t: document.imported_t,
      brands: document.brands,
      creator: document.creator,
      main_category: document.main_category,
      nutriscore_grade: document.nutriscore_grade,
      nutriscore_score: document.nutriscore_score,
      quantity: document.quantity,
      serving_quantity: document.serving_quantity,
      stores: document.stores,
      serving_size: document.serving_size,
    };
  }

  private fromValueObjectToValue<T extends VO<Y>, Y>(valueObject: T): Y {
    return valueObject.value;
  }
}
