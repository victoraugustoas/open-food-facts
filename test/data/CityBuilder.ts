import { Builder } from './Builder';
import { City } from '../../src/domain/Product/model/Cities';
import { Result } from 'src/domain/common/base/Result';
import { faker } from '@faker-js/faker';

export class CityBuilder extends Builder<City, string> {
  private name: string;

  constructor() {
    super();
    this.name = faker.commerce.productName();
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  asProps(): string {
    return this.name;
  }

  build(): Result<City> {
    return City.new(this.name);
  }
}
