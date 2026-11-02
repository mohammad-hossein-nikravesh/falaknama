import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto';

export class NewsQueryDto extends PaginationQueryDto {
  /** `current`: not yet over, soonest first. `all`: the archive, newest first. */
  @ApiPropertyOptional({ enum: ['current', 'all'] })
  @IsOptional()
  @IsIn(['current', 'all'])
  scope: 'current' | 'all' = 'all';
}
