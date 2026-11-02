// sanitize-html is CommonJS `export =` with no `default`: a default import is
// undefined wherever esModuleInterop is off (ts-jest), so require it directly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import sanitize = require('sanitize-html');

/** Where MediaService serves uploaded images; the only image source an Article may use. */
export const UPLOADS_URL = '/api/uploads/';

/**
 * Admin-authored Article HTML, reduced to what the public page styles. The
 * page title is the only h1, so headings start at h2; images must already be
 * re-hosted under UPLOADS_URL (the editor does that on paste and import).
 */
export function cleanArticleHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      'h2',
      'h3',
      'h4',
      'p',
      'br',
      'hr',
      'strong',
      'em',
      'u',
      's',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'img',
      'figure',
      'figcaption',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      h1: 'h2',
      b: 'strong',
      i: 'em',
      a: sanitize.simpleTransform('a', { rel: 'noopener', target: '_blank' }),
    },
    exclusiveFilter: (frame) =>
      frame.tag === 'img' && !frame.attribs.src?.startsWith(UPLOADS_URL),
  });
}

/** Whole minutes to read, at about 180 Persian words a minute. */
export function readingMinutes(html: string): number {
  const words = sanitize(html, { allowedTags: [], allowedAttributes: {} })
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}
