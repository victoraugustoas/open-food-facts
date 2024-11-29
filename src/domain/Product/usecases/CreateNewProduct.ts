import { UseCase } from '../../common/base/UseCase';
import { ProductRepository } from '../repository/Product.repository';
import { Product, ProductProps } from '../model/Product';
import { Result } from '../../common/base/Result';

type IN = ProductProps;

interface OUT {
  product: Product;
}

export class CreateNewProduct extends UseCase<IN, OUT> {
  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async execute(args: IN): Promise<Result<OUT>> {
    const product = Product.new(args);
    if (product.wentWrong) return product.asFail;

    const createProduct = await this.productRepository.save(product.instance);
    if (createProduct.wentWrong) return createProduct.asFail;

    return Result.ok({ product: product.instance });
  }
}
