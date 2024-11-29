import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class Trace extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<Trace> {
    return Result.ok(new Trace(name));
  }
}
