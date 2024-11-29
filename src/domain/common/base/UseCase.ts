import { Result } from './Result';

export abstract class UseCase<IN, OUT> {
  abstract execute(args: IN): Promise<Result<OUT>>;
}
