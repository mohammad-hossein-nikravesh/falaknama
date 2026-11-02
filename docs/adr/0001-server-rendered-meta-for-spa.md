# Keep the SPA; the backend injects page meta into index.html for shareable pages

Falaknama's Articles need search indexing and link previews in Telegram and WhatsApp, which do not run JavaScript. We keep the Vue SPA (ADR `frontend/docs/adr/0001`) and have the backend serve `frontend/dist/index.html` for those routes with title, description, canonical and Open Graph tags filled in from the record, and generate `sitemap.xml`. The reverse proxy routes those paths to the backend (`/articles/<slug>` to `/site/pages/articles/<slug>`, `/sitemap.xml` to `/site/sitemap.xml`; an unknown slug still gets the SPA shell, with status 404). Every visitor gets the same HTML, so there is no bot detection by user agent.

## Considered Options

- **Client-side meta only**: crawlers that skip JavaScript, including messenger previews, would see the empty shell.
- **Nuxt (SSR)**: best SEO, but rewrites the frontend stack and adds a Node render server for a handful of content routes.
