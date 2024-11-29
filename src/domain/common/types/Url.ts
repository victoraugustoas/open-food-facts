import { VO } from '../base/ValueObject';
import { Result } from '../base/Result';

export enum UrlValidationError {
  invalid_url = 'invalid_url',
}
export class Url extends VO<URL> {
  protected constructor(url: URL) {
    super(url);
  }

  static new(url: URL | string): Result<Url> {
    if (url instanceof URL) {
      return Result.ok(new Url(url));
    } else {
      if (typeof url === 'string') {
        const parsed = URL.parse(url);
        if (!parsed) {
          return Result.fail({
            type: UrlValidationError.invalid_url,
            details: { url },
          });
        }
        return Result.ok(new Url(parsed));
      }
    }
    Result.fail({ type: UrlValidationError.invalid_url, details: { url } });
  }
}
