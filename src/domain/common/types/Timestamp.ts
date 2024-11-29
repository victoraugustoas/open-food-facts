import { VO } from '../base/ValueObject';
import { Result } from '../base/Result';

export class Timestamp extends VO<number> {
  protected constructor(timestamp: number) {
    super(timestamp);
  }

  static new(timestamp: number): Result<Timestamp> {
    return Result.ok(new Timestamp(timestamp));
  }
}
