import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { ArticlesService } from '../articles/articles.service';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** docs/adr/0001: the SPA's index.html with an Article's meta filled in, and the sitemap. */
@Injectable()
export class SeoService {
  private readonly siteUrl: string;

  private readonly indexPath: string;

  constructor(
    config: ConfigService,
    private readonly articles: ArticlesService,
  ) {
    this.siteUrl = config
      .get<string>('SITE_URL', 'https://falaknama.ir')
      .replace(/\/$/, '');
    this.indexPath = resolve(
      config.get<string>('FRONTEND_INDEX', '../frontend/dist/index.html'),
    );
  }

  /** Always HTML, so the SPA can render its own not-found page; `found` sets the status. */
  async articlePage(slug: string): Promise<{ html: string; found: boolean }> {
    const html = await readFile(this.indexPath, 'utf8');
    try {
      const a = await this.articles.findPublished(slug);
      const url = `${this.siteUrl}/articles/${a.slug}`;
      const image = a.coverImage
        ? this.siteUrl + a.coverImage
        : `${this.siteUrl}/og-image.png`;
      return {
        html: this.fill(html, a.title + ' | فلک‌نما', a.summary, url, image),
        found: true,
      };
    } catch (e) {
      if (e instanceof NotFoundException) return { html, found: false };
      throw e;
    }
  }

  async sitemap(): Promise<string> {
    const fixed = ['/', '/articles', '/news', '/about'].map((p) => ({
      loc: this.siteUrl + p,
    }));
    const articles = (await this.articles.publishedIndex()).map((a) => ({
      loc: `${this.siteUrl}/articles/${a.slug}`,
      lastmod: (a as unknown as { updatedAt: Date }).updatedAt.toISOString(),
    }));
    const entries: { loc: string; lastmod?: string }[] = [
      ...fixed,
      ...articles,
    ];
    const urls = entries
      .map(
        (u) =>
          `  <url><loc>${escape(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
      )
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  }

  private fill(
    html: string,
    title: string,
    description: string,
    url: string,
    image: string,
  ) {
    const t = escape(title);
    const d = escape(description);
    const meta = (attr: string, key: string, value: string) => (doc: string) =>
      doc.replace(
        new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`),
        `$1${value}$2`,
      );
    let out = html.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);
    for (const set of [
      meta('name', 'description', d),
      meta('property', 'og:title', t),
      meta('property', 'og:description', d),
      meta('property', 'og:image', escape(image)),
      meta('property', 'og:type', 'article'),
    ])
      out = set(out);
    return out.replace(
      '</head>',
      `  <link rel="canonical" href="${escape(url)}">\n    <meta property="og:url" content="${escape(url)}">\n  </head>`,
    );
  }
}
