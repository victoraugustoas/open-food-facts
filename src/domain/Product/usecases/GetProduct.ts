import { Product } from '../model/Product';
import { UseCase } from '../../common/base/UseCase';
import { ProductRepository } from '../repository/Product.repository';
import { Result } from '../../common/base/Result';

interface IN {
  productCode: string;
}

interface OUT {
  product: Product;
}

export class GetProduct implements UseCase<IN, OUT> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(args: IN): Promise<Result<OUT>> {
    const product = await this.productRepository.getByCode(args.productCode);
    if (product.wentWrong) return product.asFail;
    return Result.ok({ product: product.instance });
  }
}
