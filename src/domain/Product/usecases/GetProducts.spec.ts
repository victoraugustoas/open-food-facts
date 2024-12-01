import { ProductRepository } from '../repository/Product.repository';
import { GetProducts } from './GetProducts';
import { ProductBuilder } from '../../../../test/data/Product.builder';
import { Result } from '../../common/base/Result';

describe('GetProducts', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
      getProducts: jest.fn(),
      getByCode: jest.fn(),
    };
  });

  test('deve retornar a lista de produtos paginados', async () => {
    const products = Array.from(Array(5)).map(
      () => new ProductBuilder().build().instance,
    );

    ProductRepositoryMock.getProducts = jest
      .fn()
      .mockResolvedValue(Result.ok({ products: products, total: 25 }));

    const useCase = new GetProducts(ProductRepositoryMock);
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.itWorked).toBe(true);
    expect(result).toMatchObject(
      Result.ok({ page: 1, limit: 10, total: 25, data: products }),
    );
  });
});
