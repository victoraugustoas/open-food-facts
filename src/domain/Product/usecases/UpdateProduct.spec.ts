import { ProductRepository } from '../provider/Product.repository';
import { UpdateProduct } from './UpdateProduct';
import { ProductBuilder } from '../../../../test/data/Product.builder';
import { Result } from '../../common/base/Result';

describe('UpdateProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
      getProducts: jest.fn(),
      getByCode: jest.fn(),
    };
  });

  test('deve alterar um produto', async () => {
    const product = new ProductBuilder();

    ProductRepositoryMock.getByCode = jest
      .fn()
      .mockResolvedValue(product.build());

    ProductRepositoryMock.save = jest.fn().mockResolvedValue(Result.ok());

    const newProductName = 'Salame Defumado';

    const useCase = new UpdateProduct(ProductRepositoryMock);

    const result = await useCase.execute({
      productCode: product.asProps().code,
      productProps: product.withProductName(newProductName).asProps(),
    });

    expect(result.itWorked).toBe(true);
    expect(result).toMatchObject(
      Result.ok(product.withProductName(newProductName).build().instance),
    );
    expect(ProductRepositoryMock.save).toHaveBeenCalledWith(
      product.withProductName(newProductName).build().instance,
    );
  });
});
