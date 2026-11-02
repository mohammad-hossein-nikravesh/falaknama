import { api } from './api';

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

export const content = {
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
