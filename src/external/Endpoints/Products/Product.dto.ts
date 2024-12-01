import {
  ProductProps,
  ProductStatus,
} from '../../../domain/Product/model/Product';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ProductDto implements ProductProps {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: ProductStatus;

  @ApiProperty()
  imported_t: Date;

  @ApiProperty()
  url?: string;

  @ApiProperty()
  creator: string;

  @ApiProperty()
  created_t: number;

  @ApiProperty()
  last_modified_t: number;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  quantity: string;

  @ApiProperty()
  brands: string;

  @ApiProperty()
  categories: string[];

  @ApiProperty()
  labels: string[];

  @ApiProperty()
  cities: string[];

  @ApiProperty()
  purchase_places: string[];

  @ApiProperty()
  stores: string;

  @ApiProperty()
  ingredients_text: string;

  @ApiProperty()
  traces: string[];

  @ApiProperty()
  serving_size: string;

  @ApiProperty()
  serving_quantity: number;

  @ApiProperty()
  nutriscore_score: number;

  @ApiProperty()
  nutriscore_grade: string;

  @ApiProperty()
  main_category: string;

  @ApiProperty()
  image_url?: string;
}

export class UpdateProductDto extends PartialType(ProductDto) {}
