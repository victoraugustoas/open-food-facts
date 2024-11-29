import { Product } from '../model/Product';
import { Result } from '../../common/base/Result';

export abstract class ProductRepository {
  abstract getByCode(code: string): Promise<Result<number>>;

  abstract save(product: Product): Promise<Result<void>>;
  abstract delete(product: Product): Promise<Result<void>>;
}
