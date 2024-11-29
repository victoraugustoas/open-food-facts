import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class City extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<City> {
    return Result.ok(new City(name));
  }
}
