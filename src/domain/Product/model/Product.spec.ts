import { Product, ProductStatus } from './Product';
import { ProductBuilder } from '../../../../test/data/Product.builder';

describe('Product', () => {
  test('deve criar um produto', () => {
    const product = new ProductBuilder().build();
    expect(product.itWorked).toBe(true);
    expect(product.wentWrong).toBe(false);
    expect(product.instance).toBeInstanceOf(Product);
  });

  test('deve apagar um produto', () => {
    const product = new ProductBuilder()
      .withProductStatus(ProductStatus.published)
      .build();

    expect(product.itWorked).toBe(true);
    expect(product.instance.status).toBe(ProductStatus.published);

    product.instance.delete();

    expect(product.instance.status).toBe(ProductStatus.trash);
  });
});
