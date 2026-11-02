import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'چرا ساعت دقیق تولد مهم است؟' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  question: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(1500)
  answer: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  order?: number;
}
