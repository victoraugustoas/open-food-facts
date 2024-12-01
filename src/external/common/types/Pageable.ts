import * as Domain from '../../../domain/common/types/Pageable';
import { ApiProperty } from '@nestjs/swagger';

export class PageableResponse<T> implements Domain.PageableResponse<T> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  data: T[];
}
