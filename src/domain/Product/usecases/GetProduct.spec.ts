import { ProductRepository } from '../provider/Product.repository';
import { ProductBuilder } from '../../../../test/data/Product.builder';
import { Result } from '../../common/base/Result';
import { GetProduct } from './GetProduct';
import { ProductStatus } from '../model/Product';

describe('GetProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
      getProducts: jest.fn(),
      getByCode: jest.fn(),
    };
  });

  test('deve retornar um produto', async () => {
    const product = new ProductBuilder();

    ProductRepositoryMock.getByCode = jest
      .fn()
      .mockResolvedValue(product.build());

    const useCase = new GetProduct(ProductRepositoryMock);
    const result = await useCase.execute({
      productCode: product.asProps().code,
    });

    expect(result.itWorked).toBe(true);
    expect(result).toMatchObject(
      Result.ok({ product: product.build().instance }),
    );
  });

  test('deve retornar erro para produtos com status diferente de published', async () => {
    const product = new ProductBuilder().withProductStatus(ProductStatus.draft);

    ProductRepositoryMock.getByCode = jest
      .fn()
      .mockResolvedValue(product.build());

    const useCase = new GetProduct(ProductRepositoryMock);
    const result = await useCase.execute({
      productCode: product.asProps().code,
    });

    expect(result.itWorked).toBe(false);
    expect(result).toMatchObject(
      Result.fail({
        type: 'product_not_found',
        details: { productCode: product.asProps().code },
      }),
    );
  });
});
