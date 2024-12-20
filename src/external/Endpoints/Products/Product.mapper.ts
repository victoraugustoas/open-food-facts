import { Product } from '../../../domain/Product/model/Product';
import { ProductDto } from './Product.dto';

export class ProductMapper {
  toJSON(product: Product): ProductDto {
    return {
      ...product.props,
      url: product.url?.value.toString(),
      image_url: product.imageUrl?.value.toString(),
      traces: product.traces.map((r) => r.value),
      cities: product.cities.map((r) => r.value),
      labels: product.labels.map((r) => r.value),
      purchase_places: product.purchasePlaces.map((r) => r.value),
      categories: product.categories.map((r) => r.value),
      status: product.status,
    };
  }
}
