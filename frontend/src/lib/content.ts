import { api, ApiError } from './api';

// Public, read-only content served by the backend's /site routes.

export interface ArticleSummary {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  publishedAt: string;
  readingMinutes: number;
}

export interface Article extends ArticleSummary {
  body: string;
}

export interface NewsItem {
  _id: string;
  title: string;
  body: string;
  image?: string;
  startsAt: string;
  endsAt?: string | null;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
}

export interface Page<T> {
  items: T[];
  total: number;
}

/** Static preview build (GitHub Pages, no backend): VITE_DEMO=1 serves the bundled sample content. */
export const isDemo = import.meta.env.VITE_DEMO === '1';

const live = {
  articles: (limit = 9, offset = 0) =>
    api.get<Page<ArticleSummary>>(
      `/site/articles?limit=${limit}&offset=${offset}`,
    ),
  article: (slug: string) =>
    api.get<Article>(`/site/articles/${encodeURIComponent(slug)}`),
  /** `current`: not yet over, soonest first (the Landing page). `all`: newest first. */
  news: (scope: 'current' | 'all', limit = 12, offset = 0) =>
    api.get<Page<NewsItem>>(
      `/site/news?scope=${scope}&limit=${limit}&offset=${offset}`,
    ),
  faqs: () => api.get<Faq[]>('/site/faqs'),
};

/** Same rules as the backend (`/site/*`), over `demo-content.json`; the dynamic import keeps it out of normal builds. */
const demo: typeof live = {
  articles: async (limit = 9, offset = 0) => {
    const { default: data } = await import('./demo-content.json');
    const items = data.articles.map((a) => {
      const summary: Partial<Article> = { ...a };
      delete summary.body; // list pages carry no bodies, as in the API
      return summary as ArticleSummary;
    });
    return { items: items.slice(offset, offset + limit), total: items.length };
  },
  article: async (slug) => {
    const { default: data } = await import('./demo-content.json');
    const found = data.articles.find((a) => a.slug === slug);
    if (!found) throw new ApiError('مقاله یافت نشد', 404);
    return found;
  },
  news: async (scope, limit = 12, offset = 0) => {
    const { default: data } = await import('./demo-content.json');
    const dayAgo = Date.now() - 86_400_000;
    const items: NewsItem[] =
      scope === 'current'
        ? data.news
            .filter((n) => new Date(n.endsAt ?? n.startsAt).getTime() >= dayAgo)
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
        : [...data.news].sort((a, b) => b.startsAt.localeCompare(a.startsAt));
    return { items: items.slice(offset, offset + limit), total: items.length };
  },
  faqs: async () => (await import('./demo-content.json')).default.faqs,
};

export const content = isDemo ? demo : live;
