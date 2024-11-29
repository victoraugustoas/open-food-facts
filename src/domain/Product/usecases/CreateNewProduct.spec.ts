import { ProductBuilder } from '../../../../test/data/Product.builder';
import { ProductRepository } from '../repository/Product.repository';
import { CreateNewProduct } from './CreateNewProduct';
import { Result } from '../../common/base/Result';

describe('CreateNewProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
      delete: jest.fn(),
      getByCode: jest.fn(),
    };
  });

  test('deve criar um novo produto', async () => {
    const product = new ProductBuilder().build();

    expect(product.itWorked).toBe(true);
    expect(product.instance).toMatchObject(product.instance);
  });

  test('deve criar um novo produto no repositório', async () => {
    const product = new ProductBuilder();

    ProductRepositoryMock.save = jest.fn().mockResolvedValue(Result.ok());

    const useCase = new CreateNewProduct(ProductRepositoryMock);
    const result = await useCase.execute(product.asProps());

    expect(result.itWorked).toBe(true);
    expect(result).toMatchObject(
      Result.ok({ product: product.build().instance }),
    );
  });
});
