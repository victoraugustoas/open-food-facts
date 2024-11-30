import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ProductProps,
  ProductStatus,
} from '../../../domain/Product/model/Product';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'Products' })
export class Product implements ProductProps {
  @Prop()
  code: string;
  @Prop()
  status: ProductStatus;
  @Prop()
  imported_t: Date;
  @Prop()
  url?: string;
  @Prop()
  creator: string;
  @Prop()
  created_t: number;
  @Prop()
  last_modified_t: number;
  @Prop()
  product_name: string;
  @Prop()
  quantity: string;
  @Prop()
  brands: string;
  @Prop()
  categories: string[];
  @Prop()
  labels: string[];
  @Prop()
  cities: string[];
  @Prop()
  purchase_places: string[];
  @Prop()
  stores: 'Lidl';
  @Prop()
  ingredients_text: string[];
  @Prop()
  traces: string[];
  @Prop()
  serving_size: string;
  @Prop()
  serving_quantity: number;
  @Prop()
  nutriscore_score: number;
  @Prop()
  nutriscore_grade: string;
  @Prop()
  main_category: string;
  @Prop()
  image_url?: string;
  @Prop()
  id: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
