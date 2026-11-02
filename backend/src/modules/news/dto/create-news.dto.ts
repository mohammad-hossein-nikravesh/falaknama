import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { UPLOADS_URL } from '../../common/utils/rich-text';

export class CreateNewsDto {
  @ApiProperty({ example: 'عطارد برگشتی می‌شود' })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(800)
  body: string;

  @ApiPropertyOptional({ example: `${UPLOADS_URL}<id>.webp` })
  @IsOptional()
  @Matches(new RegExp(`^${UPLOADS_URL}[\\w-]+\\.webp$`))
  image?: string;

  @ApiProperty({ example: '2026-11-09' })
  @IsDateString()
  startsAt: string;

  @ApiPropertyOptional({ example: '2026-11-29', nullable: true })
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsDateString()
  endsAt?: string | null;
}
