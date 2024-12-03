import { Product, ProductProps } from '../model/Product';
import { UseCase } from '../../common/base/UseCase';
import { ProductRepository } from '../provider/Product.repository';
import { Result } from '../../common/base/Result';

interface IN {
  productCode: string;
  productProps: Partial<ProductProps>;
}

type OUT = Product;

export class UpdateProduct implements UseCase<IN, OUT> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(args: IN): Promise<Result<OUT>> {
    const product = await this.productRepository.getByCode(args.productCode);
    if (product.wentWrong) return product.asFail;

    const updatedProduct = product.instance.copyWith(args.productProps);
    if (updatedProduct.wentWrong) return updatedProduct.asFail;

    const saveInRepo = await this.productRepository.save(
      updatedProduct.instance,
    );
    if (saveInRepo.wentWrong) return saveInRepo.asFail;

    return Result.ok(updatedProduct.instance);
  }
}
