import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import * as mammoth from 'mammoth';
import sharp from 'sharp';
import { cleanArticleHtml, UPLOADS_URL } from '../common/utils/rich-text';

export const MAX_IMAGE_MB = 5;
// Google Docs serves pasted images from these hosts, behind expiring links.
const REMOTE_IMAGE_HOSTS = /(^|\.)googleusercontent\.com$/;

/** Images on the server's disk (UPLOAD_DIR), always re-encoded as WebP. */
@Injectable()
export class MediaService {
  readonly dir: string;

  constructor(config: ConfigService) {
    this.dir = resolve(config.get<string>('UPLOAD_DIR', 'uploads'));
    mkdirSync(this.dir, { recursive: true });
  }

  /** Re-encoding also strips metadata and rejects anything that is not really an image. */
  async saveImage(input: Buffer): Promise<string> {
    let webp: Buffer;
    try {
      webp = await sharp(input)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new BadRequestException('فایل تصویر معتبر نیست');
    }
    const name = `${randomUUID()}.webp`;
    await writeFile(join(this.dir, name), webp);
    return UPLOADS_URL + name;
  }

  /** Copies an image pasted from Google Docs before its link expires. */
  async saveFromUrl(url: string): Promise<string> {
    const parsed = new URL(url);
    if (
      parsed.protocol !== 'https:' ||
      !REMOTE_IMAGE_HOSTS.test(parsed.hostname)
    ) {
      throw new BadRequestException(
        'فقط تصویرهای Google Docs قابل انتقال هستند',
      );
    }
    const res = await fetch(parsed, {
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new BadRequestException('دریافت تصویر ناموفق بود');
    const body = Buffer.from(await res.arrayBuffer());
    if (body.length > MAX_IMAGE_MB * 1024 * 1024) {
      throw new BadRequestException(
        `حجم تصویر بیش از ${MAX_IMAGE_MB} مگابایت است`,
      );
    }
    return this.saveImage(body);
  }

  /** A .docx (e.g. Google Docs → Download → Word) as clean Article HTML, its images saved. */
  async importDocx(
    file: Buffer,
  ): Promise<{ html: string; warnings: string[] }> {
    try {
      const result = await mammoth.convertToHtml(
        { buffer: file },
        {
          convertImage: mammoth.images.imgElement(async (image) => ({
            src: await this.saveImage(await image.readAsBuffer()),
          })),
        },
      );
      return {
        html: cleanArticleHtml(result.value),
        warnings: result.messages
          .filter((m) => m.type === 'warning')
          .map((m) => m.message),
      };
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new BadRequestException('فایل Word خوانده نشد');
    }
  }
}
