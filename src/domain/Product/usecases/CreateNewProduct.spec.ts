import { ProductBuilder } from '../../../../test/data/Product.builder';
import { ProductRepository } from '../provider/Product.repository';
import { CreateNewProduct } from './CreateNewProduct';
import { Result } from '../../common/base/Result';

describe('CreateNewProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      getProducts: jest.fn(),
      save: jest.fn(),
      getByCode: jest.fn(),
    };
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
    expect(ProductRepositoryMock.save).toHaveBeenCalledWith(
      product.build().instance,
    );
  });
});
