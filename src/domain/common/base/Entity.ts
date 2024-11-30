import { Result } from './Result';
import { v4 as uuidV4 } from 'uuid';

export class Identity {
  id: string;

  constructor(id?: string) {
    this.id = id ? id : uuidV4();
  }
}

export interface EntityProps {
  id: string;
}

export abstract class Entity<
  Type,
  IdentityType extends Identity,
  Props extends EntityProps,
> {
  protected constructor(
    readonly id: IdentityType,
    readonly props: Props,
  ) {}

  abstract copyWith(props: Partial<Props>): Result<Type>;
}
