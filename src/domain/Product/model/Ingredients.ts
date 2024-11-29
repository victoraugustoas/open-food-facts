import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class Ingredients extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<Ingredients> {
    return Result.ok(new Ingredients(name));
  }
}
