import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class Label extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<Label> {
    return Result.ok(new Label(name));
  }
}
