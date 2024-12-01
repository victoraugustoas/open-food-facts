import { Product } from '../model/Product';
import { Result } from '../../common/base/Result';

export abstract class ProductRepository {
  abstract getProducts(
    page: number,
    limit: number,
  ): Promise<Result<{ products: Product[]; total: number }>>;
  abstract getByCode(code: string): Promise<Result<Product>>;
  abstract save(product: Product): Promise<Result<void>>;
}
