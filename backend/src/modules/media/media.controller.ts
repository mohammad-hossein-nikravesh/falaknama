import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesEnum } from '../auth/enums/roles.enum';
import { ImageUrlDto } from './dto';
import { MAX_IMAGE_MB, MediaService } from './media.service';

const MB = 1024 * 1024;

@ApiTags('media')
@Roles(RolesEnum.ADMIN)
@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post('images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_IMAGE_MB * MB } }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('فایلی ارسال نشد');
    return { url: await this.media.saveImage(file.buffer) };
  }

  @Post('images/from-url')
  async fromUrl(@Body() { url }: ImageUrlDto) {
    return { url: await this.media.saveFromUrl(url) };
  }

  @Post('import-docx')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 30 * MB } }))
  importDocx(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('فایلی ارسال نشد');
    return this.media.importDocx(file.buffer);
  }
}
