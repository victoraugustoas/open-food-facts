import { ProductRepository } from '../repository/Product.repository';
import { ProductBuilder } from '../../../../test/data/Product.builder';
import { Result } from '../../common/base/Result';
import { GetProduct } from './GetProduct';

describe('GetProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
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
});
