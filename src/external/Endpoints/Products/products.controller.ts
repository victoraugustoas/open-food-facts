import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteProduct } from '../../../domain/Product/usecases/DeleteProduct';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MongoUnityOfWork } from '../../common/implementation/MongoUnityOfWork';
import { ProductMongoRepo } from '../../Repository/ProductMongoRepo.repository';
import * as Mongo from '../../Database/schemas/Product.schema';
import { ProductRepository } from '../../../domain/Product/repository/Product.repository';
import { Result } from '../../../domain/common/base/Result';
import { Error } from '../../../domain/common/base/Error';
import { GetProduct } from '../../../domain/Product/usecases/GetProduct';
import { ProductMapper } from './Product.mapper';
import { GetProducts } from '../../../domain/Product/usecases/GetProducts';
import { UpdateProduct } from '../../../domain/Product/usecases/UpdateProduct';
import { ProductProps } from '../../../domain/Product/model/Product';

@Controller('products')
export class ProductsController {
  constructor(
    @InjectModel(Mongo.Product.name)
    private productModel: Model<Mongo.Product>,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  @Get()
  async getProducts(
    @Query('page', ParseIntPipe) page = 0,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    const unityOfWork = new MongoUnityOfWork(this.connection);
    const productRepo: ProductRepository = new ProductMongoRepo(
      this.productModel,
      unityOfWork,
    );
    const useCase = new GetProducts(productRepo);
    const result = await useCase.execute({ limit, page });
    this.handleErrors(result);

    const mapper = new ProductMapper().toJSON;
    return {
      page: result.instance.page,
      limit: result.instance.limit,
      total: result.instance.total,
      data: result.instance.data.map((p) => mapper(p)),
    };
  }

  @Get(':code')
  async getProduct(@Param('code') code: string) {
    const unityOfWork = new MongoUnityOfWork(this.connection);
    const productRepo: ProductRepository = new ProductMongoRepo(
      this.productModel,
      unityOfWork,
    );
    const useCase = new GetProduct(productRepo);
    const result = await useCase.execute({ productCode: code });
    this.handleErrors(result);
    return new ProductMapper().toJSON(result.instance.product);
  }

  @Put(':code')
  async updateProduct(
    @Param('code') code: string,
    @Body() productParams: Partial<ProductProps>,
  ) {
    const unityOfWork = new MongoUnityOfWork(this.connection);
    try {
      await unityOfWork.begin();
      const productRepo: ProductRepository = new ProductMongoRepo(
        this.productModel,
        unityOfWork,
      );
      const useCase = new UpdateProduct(productRepo);
      const result = await useCase.execute({
        productCode: code,
        productProps: productParams,
      });
      this.handleErrors(result);
      await unityOfWork.commit();

      return new ProductMapper().toJSON(result.instance);
    } catch (e) {
      await unityOfWork.rollback();
      throw e;
    }
  }

  @Delete(':code')
  async deleteProduct(@Param('code') code: string) {
    const unityOfWork = new MongoUnityOfWork(this.connection);
    try {
      await unityOfWork.begin();
      const productRepo: ProductRepository = new ProductMongoRepo(
        this.productModel,
        unityOfWork,
      );
      const useCase = new DeleteProduct(productRepo);
      const result = await useCase.execute({ productCode: code });
      this.handleErrors(result);
      await unityOfWork.commit();
    } catch (e) {
      await unityOfWork.rollback();
      throw e;
    }
  }

  private catchException(error: Error) {
    const returnedError = { errors: [error] };
    switch (error.type) {
      case 'product_not_found':
        return new NotFoundException(returnedError);
      default:
        return new BadRequestException(returnedError);
    }
  }

  private handleErrors(result: Result<any>): void {
    if (result.wentWrong) {
      if (result.errors.length === 1) {
        throw this.catchException(result.errors[0]);
      }
      throw new BadRequestException({ errors: result.errors });
    }
  }
}
