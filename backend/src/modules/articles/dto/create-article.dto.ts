import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UPLOADS_URL } from '../../common/utils/rich-text';
import { ArticleStatus } from '../article.model';

export class CreateArticleDto {
  @ApiProperty({ example: 'برگشت عطارد چیست؟' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'mercury-retrograde' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'آدرس فقط می‌تواند حروف کوچک انگلیسی، عدد و خط تیره داشته باشد',
  })
  @MaxLength(120)
  slug: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(320)
  summary: string;

  @ApiPropertyOptional({ example: `${UPLOADS_URL}<id>.webp` })
  @IsOptional()
  @Matches(new RegExp(`^${UPLOADS_URL}[\\w-]+\\.webp$`))
  coverImage?: string;

  @ApiProperty({ description: 'HTML; sanitised on save' })
  @IsString()
  @MinLength(1)
  body: string;

  @ApiPropertyOptional({ enum: ArticleStatus })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiPropertyOptional({
    description: 'Defaults to the moment it is first published',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
