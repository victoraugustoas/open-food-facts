import { Entity, EntityProps, Identity } from '../../common/base/Entity';
import { Category } from './Category';
import { Label } from './Label';
import { Timestamp } from '../../common/types/Timestamp';
import { Ingredients } from './Ingredients';
import { City } from './Cities';
import { MarketStore } from './MarketStore';
import { Url } from '../../common/types/Url';
import { Trace } from './Trace';
import { Result } from '../../common/base/Result';

export class ProductID extends Identity {
  constructor(id?: string) {
    super(id);
  }
}

export enum ProductStatus {
  published = 'published',
  draft = 'draft',
  trash = 'trash',
}

export interface ProductProps extends EntityProps {
  code: string;
  status: ProductStatus;
  imported_t: Date;
  url: string;
  creator: string;
  created_t: number;
  last_modified_t: number;
  product_name: string;
  quantity: string;
  brands: string;
  categories: string[];
  labels: string[];
  cities: string[];
  purchase_places: string[];
  stores: 'Lidl';
  ingredients_text: string[];
  traces: string[];
  serving_size: string;
  serving_quantity: number;
  nutriscore_score: number;
  nutriscore_grade: string;
  main_category: string;
  image_url: string;
}

export class Product extends Entity<Product, ProductID, ProductProps> {
  protected constructor(id: ProductID, props: ProductProps) {
    super(id, props);
  }

  static new(props: ProductProps): Result<Product> {
    const url = Url.new(props.url);
    const created_t = Timestamp.new(props.created_t);
    const last_modified_t = Timestamp.new(props.last_modified_t);
    const categories = Result.combine(
      props.categories.map((c) => Category.new(c)),
    );
    const labels = Result.combine(props.labels.map((l) => Label.new(l)));
    const cities = Result.combine(props.cities.map((c) => City.new(c)));
    const purchase_places = Result.combine(
      props.purchase_places.map((c) => MarketStore.new(c)),
    );
    const ingredients = Result.combine(
      props.ingredients_text.map((i) => Ingredients.new(i)),
    );
    const traces = Result.combine(props.traces.map((t) => Trace.new(t)));
    const image_url = Url.new(props.image_url);

    const result = Result.combine<any>([
      url,
      created_t,
      last_modified_t,
      categories,
      labels,
      cities,
      purchase_places,
      ingredients,
      traces,
      image_url,
    ]);
    if (result.wentWrong) return result.asFail;

    return Result.ok(new Product(new ProductID(props.id), props));
  }

  copyWith(props: Partial<ProductProps>): Result<Product> {
    return Product.new({ ...this.props, ...props });
  }
}
