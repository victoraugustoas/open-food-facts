import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class Category extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<Category> {
    return Result.ok(new Category(name));
  }
}
