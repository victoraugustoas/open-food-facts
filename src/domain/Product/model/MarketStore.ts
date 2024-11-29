import { VO } from '../../common/base/ValueObject';
import { Result } from '../../common/base/Result';

export class MarketStore extends VO<string> {
  protected constructor(name: string) {
    super(name);
  }

  static new(name: string): Result<MarketStore> {
    return Result.ok(new MarketStore(name));
  }
}
