import { Product } from '../model/Product';
import { Result } from '../../common/base/Result';

export abstract class ProductRepository {
  abstract getByCode(code: string): Promise<Result<Product>>;
  abstract save(product: Product): Promise<Result<void>>;
}
