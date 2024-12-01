import { Product } from '../model/Product';
import { UseCase } from '../../common/base/UseCase';
import { ProductRepository } from '../repository/Product.repository';
import { PageableRequest, PageableResponse } from '../../common/types/Pageable';
import { Result } from '../../common/base/Result';

type IN = PageableRequest;
type OUT = PageableResponse<Product>;

export class GetProducts implements UseCase<IN, OUT> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(args: IN): Promise<Result<OUT>> {
    const products = await this.productRepository.getProducts(
      args.page,
      args.limit,
    );
    if (products.wentWrong) return products.asFail;

    return Result.ok({
      ...args,
      total: products.instance.total,
      data: products.instance.products,
    });
  }
}
