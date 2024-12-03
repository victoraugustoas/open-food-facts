import { UseCase } from '../../common/base/UseCase';
import { ProductRepository } from '../provider/Product.repository';
import { Result } from '../../common/base/Result';

interface IN {
  productCode: string;
}

type OUT = Result<void>;

export class DeleteProduct implements UseCase<IN, OUT> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(args: IN): Promise<Result<OUT>> {
    const product = await this.productRepository.getByCode(args.productCode);
    if (product.wentWrong) return product.asFail;

    // mark product as deleted
    product.instance.delete();

    const save = await this.productRepository.save(product.instance);
    if (save.wentWrong) return save.asFail;

    return Result.ok();
  }
}
