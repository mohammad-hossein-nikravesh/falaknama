import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { SeoService } from './seo.service';

/**
 * Reached through the reverse proxy, not the SPA: `/sitemap.xml` and
 * `/articles/<slug>` are mapped here (see docs/adr/0001). Responses bypass the
 * JSON envelope by writing to `res` directly.
 */
@ApiExcludeController()
@Public()
@Controller('site')
export class SeoController {
  constructor(private readonly seo: SeoService) {}

  @Get('sitemap.xml')
  @Header('Cache-Control', 'public, max-age=3600')
  async sitemap(@Res() res: Response) {
    res.type('application/xml').send(await this.seo.sitemap());
  }

  @Get('pages/articles/:slug')
  async article(@Param('slug') slug: string, @Res() res: Response) {
    const { html, found } = await this.seo.articlePage(slug);
    res
      .status(found ? 200 : 404)
      .type('html')
      .send(html);
  }
}
