import { Entity, EntityProps, Identity } from '../../common/base/Entity';
import { Category } from './Category';
import { Label } from './Label';
import { Timestamp } from '../../common/types/Timestamp';
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
  url?: string;
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
  stores: string;
  ingredients_text: string;
  traces: string[];
  serving_size: string;
  serving_quantity: number;
  nutriscore_score: number;
  nutriscore_grade: string;
  main_category: string;
  image_url?: string;
}

export class Product extends Entity<Product, ProductID, ProductProps> {
  protected constructor(
    readonly id: ProductID,
    readonly imported_t: Date,
    private _status: ProductStatus,
    readonly categories: Category[],
    readonly labels: Label[],
    readonly cities: City[],
    readonly purchasePlaces: MarketStore[],
    readonly traces: Trace[],
    readonly props: ProductProps,
    readonly url?: Url,
    readonly imageUrl?: Url,
  ) {
    super(id, props);
  }

  get status(): ProductStatus {
    return this._status;
  }

  static new(props: ProductProps): Result<Product> {
    try {
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
      const traces = Result.combine(props.traces.map((t) => Trace.new(t)));
      const url: Result<Url> | Result<undefined> = props.url
        ? Url.new(props.url)
        : Result.undefined();
      const image_url: Result<Url> | Result<undefined> = props.image_url
        ? Url.new(props.image_url)
        : Result.undefined();

      const result = Result.combine<any>([
        url,
        created_t,
        last_modified_t,
        categories,
        labels,
        cities,
        purchase_places,
        traces,
        image_url,
      ]);
      if (result.wentWrong) return result.asFail;

      return Result.ok(
        new Product(
          new ProductID(props.code),
          props.imported_t,
          props.status,
          categories.instance,
          labels.instance,
          cities.instance,
          purchase_places.instance,
          traces.instance,
          props,
          url.instance,
          image_url.instance,
        ),
      );
    } catch (e) {
      return Result.fail({
        type: 'invalid_product',
        details: { props, error: e },
      });
    }
  }

  copyWith(props: Partial<ProductProps>): Result<Product> {
    return Product.new({ ...this.props, ...props });
  }

  public delete() {
    this._status = ProductStatus.trash;
  }
}
