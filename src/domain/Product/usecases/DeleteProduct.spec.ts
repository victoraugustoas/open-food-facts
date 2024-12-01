import { DeleteProduct } from './DeleteProduct';
import { ProductRepository } from '../repository/Product.repository';
import { Result } from '../../common/base/Result';
import { ProductBuilder } from '../../../../test/data/Product.builder';
import { ProductStatus } from '../model/Product';

describe('DeleteProduct', () => {
  let ProductRepositoryMock: ProductRepository;

  beforeEach(() => {
    ProductRepositoryMock = {
      save: jest.fn(),
      getByCode: jest.fn(),
    };
  });

  test('deve apagar o produto corretamente', async () => {
    const product = new ProductBuilder()
      .withCode('2020')
      .withProductStatus(ProductStatus.published);

    ProductRepositoryMock.save = jest.fn().mockResolvedValue(Result.ok());
    ProductRepositoryMock.getByCode = jest
      .fn()
      .mockResolvedValue(product.build());

    const useCase = new DeleteProduct(ProductRepositoryMock);

    const result = await useCase.execute({ productCode: '2020' });

    expect(result.itWorked).toBe(true);
    expect(ProductRepositoryMock.save).toHaveBeenCalledWith(
      product.withProductStatus(ProductStatus.trash).build().instance,
    );
    expect(result).toMatchObject(Result.ok());
  });
});
