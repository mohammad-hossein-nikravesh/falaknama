import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ImageUrlDto {
  @ApiProperty({ example: 'https://lh7-rt.googleusercontent.com/docsz/…' })
  @IsUrl({ protocols: ['https'], require_protocol: true })
  url: string;
}
