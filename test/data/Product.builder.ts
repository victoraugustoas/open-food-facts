import { Builder } from './Builder';
import {
  Product,
  ProductProps,
  ProductStatus,
} from '../../src/domain/Product/model/Product';
import { Result } from 'src/domain/common/base/Result';
import { faker } from '@faker-js/faker';

function generateArray<T>(maxItems: number, generateValue: () => T) {
  return Array.from(Array(faker.number.int({ min: 1, max: maxItems }))).map(
    generateValue,
  );
}

export class ProductBuilder extends Builder<Product, ProductProps> {
  private readonly props: ProductProps;

  constructor(props?: ProductProps) {
    super();
    this.props = {
      id: faker.string.uuid(),
      traces: generateArray(10, () => faker.food.adjective()),
      ingredients_text: generateArray(10, () => faker.food.ingredient()),
      cities: generateArray(10, () => faker.location.city()),
      labels: generateArray(10, () => faker.food.meat()),
      categories: generateArray(10, () => faker.food.adjective()),
      url: faker.internet.url(),
      last_modified_t: faker.date.past().getTime(),
      created_t: faker.date.past().getTime(),
      code: faker.number.int().toString(),
      brands: generateArray(10, () => faker.company.name()),
      creator: faker.person.fullName(),
      image_url: faker.image.url(),
      imported_t: faker.date.past().getTime(),
      purchase_places: generateArray(10, () => faker.location.city()),
      main_category: faker.food.meat(),
      nutriscore_grade: faker.food.dish(),
      product_name: faker.food.meat(),
      nutriscore_score: faker.number.int({ min: 0 }),
      quantity: '',
      serving_quantity: faker.number.int({ min: 1 }),
      status: [
        ProductStatus.draft,
        ProductStatus.published,
        ProductStatus.trash,
      ][faker.number.int({ min: 0, max: 2 })],
      stores: generateArray(10, () => faker.location.city()),
      serving_size: '',
      ...props,
    };
  }

  asProps(): ProductProps {
    return this.props;
  }

  withProductStatus(value: ProductStatus): this {
    this.props.status = value;
    return this;
  }

  withCode(value: string): this {
    this.props.code = value;
    return this;
  }

  build(): Result<Product> {
    return Product.new(this.props);
  }
}
