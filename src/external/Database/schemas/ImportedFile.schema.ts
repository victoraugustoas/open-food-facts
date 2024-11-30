import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImportedFileDocument = HydratedDocument<ImportedFile>;

@Schema({ collection: 'ImportedFiles' })
export class ImportedFile {
  @Prop()
  fileName: string;

  @Prop()
  wasProcessed: boolean;
}

export const ImportedFileSchema = SchemaFactory.createForClass(ImportedFile);
