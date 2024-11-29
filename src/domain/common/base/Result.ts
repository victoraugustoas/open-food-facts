import { Error } from './Error';

export class Result<T> {
  constructor(
    private readonly _instance?: T | null,
    private _errors?: Error[],
  ) {}

  get instance(): T {
    return this._instance!;
  }

  get errors(): Error[] | undefined {
    return this._errors;
  }

  get itWorked(): boolean {
    return !this.errors;
  }

  get wentWrong(): boolean {
    return !!this.errors;
  }

  get asFail(): Result<any> {
    return Result.fail<any>(this.errors!);
  }

  static ok<T>(instance?: T): Result<T> {
    return new Result<T>(instance ?? undefined);
  }

  static undefined(): Result<undefined> {
    return new Result<undefined>(undefined);
  }

  static null(): Result<null> {
    return new Result<null>(null);
  }

  static fail<T>(e: string | Error | Error[]): Result<T> {
    const error = typeof e === 'string' ? [{ type: e } as Error] : e;
    return new Result<T>(undefined, Array.isArray(error) ? error : [error]);
  }

  static toFail<T>(e: any): Result<T> {
    return Result.fail<T>({ type: e.message ?? e });
  }

  static async try<T>(fn: () => Promise<Result<T>>): Promise<Result<T>> {
    try {
      return fn();
    } catch (e: any) {
      return Result.toFail<T>(e);
    }
  }

  static trySync<T>(fn: () => T): Result<T> {
    try {
      return Result.ok<T>(fn());
    } catch (e: any) {
      return Result.toFail<T>(e);
    }
  }

  static combine<T>(Results: Result<T>[]): Result<T[]> {
    const errors = Results.filter((r) => r.wentWrong);
    const instances = Results.map((r) => r._instance);
    return errors.length > 0
      ? Result.fail<T[]>(errors.flatMap((r) => r.errors!))
      : Result.ok<T[]>(instances as T[]);
  }

  static async combineAsync<T>(
    Results: Promise<Result<T>>[],
  ): Promise<Result<T[]>> {
    const rs = await Promise.all(Results);
    return Result.combine(rs);
  }

  throwErrorIfError(): never | void {
    if (this.wentWrong) {
      throw this.errors;
    }
  }
}
