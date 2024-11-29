import { Result } from '../../src/domain/common/base/Result';

export abstract class Builder<T, Props> {
  abstract asProps(): Props;
  abstract build(): Result<T>;
}
