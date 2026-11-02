# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:

- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## User Preferences

When the user requests a durable behavior change, record it here or in the relevant child AGENTS.md

## User Preferences (Standing)

- Write reports and summaries to the user in Persian (فارسی); keep code, identifiers, commands, and file paths in English

## Backend Contracts

- Layering, as in `modules/users`: the controller only routes (decorators, params, DTOs) and calls the service; the service holds the logic and extends `BaseService`; the repository extends `BaseRepository` and is the only place that touches Mongoose models. `auth` follows the same trio
- DTOs live in each module's `dto/` folder, one class per `<name>.dto.ts` file, re-exported from `dto/index.ts`; controllers and services import from the barrel (`./dto`). Shared ones are in `modules/common/dto`
- Backend is REST only (NestJS + MongoDB); new collections extend the generic controller/service/repository in `backend/src/modules/common/generic/`. Feature modules: `users`, `auth`, and Falaknama content: `articles`, `news`, `faqs`, `media`, `seo`
- Content modules: the generic CRUD controller is ADMIN-only (`@Roles(ADMIN)`) and overrides `GET /` with a paged or ordered list; visitors read through a separate `@Public()` controller under `/site/*` (`/site/articles`, `/site/news?scope=current|all`, `/site/faqs`)
- Article HTML is sanitised on save by `cleanArticleHtml` (`common/utils/rich-text.ts`); images must be hosted under `/api/uploads/`. `media` saves images to `UPLOAD_DIR` (default `backend/uploads`, gitignored) re-encoded as WebP, re-hosts Google Docs image links, and converts `.docx` with mammoth; `main.ts` serves the folder at `/uploads`
- CommonJS packages without a `default` export that tests execute (e.g. `sanitize-html`) use `import x = require()`: ts-jest runs without `esModuleInterop`, so a default import is `undefined` there although the SWC build works
- `bun run seed:content` (backend) fills empty Article, News and FAQ collections with starter Persian content
- Guards, response interceptor, exception filter, and validation pipes are registered as providers in `backend/src/app.module.ts`, not in `main.ts`
- The generic REST controller exposes an id-scoped `DELETE /:id` (`deleteById`, never `deleteMany`)
- `NODE_ENV` is one of `development`, `production` or `test`; the env validator rejects anything else. Production gating uses `isProduction()` (`backend/src/modules/common/utils/is-production.ts`)
- External integrations (Telegram, Redis, S3, SMS, Pusher) are optional and no-op when their env vars are unset; see `backend/docs/adr/0003-optional-integrations.md` and `backend/src/modules/common/AGENTS.md`

## Frontend Contracts

- `frontend/` is Vue 3 + Vite + Tailwind v4 + shadcn-vue + vue-router (no Pinia, no GraphQL client); see `frontend/docs/adr/0001-frontend-stack.md`. Admin-only extras: Tiptap (Article editor, `components/admin/RichEditor.vue`) and `jalaali-js`
- All backend traffic goes through `frontend/src/lib/api.ts` (base `/api`, proxied by Vite to `:3003`); auth is email + password only, the JWT lives in localStorage, and any 401 redirects to `/login`
- Themes: the default lives in `src/assets/main.css`; each extra theme is a `[data-theme]` block pair in `src/assets/themes.css` plus an entry in `src/composables/useTheme.ts`. Users pick theme and dark mode on the Settings page. Themes apply to the admin panel only
- Routes: the public Falaknama site is `/` (`views/site/`, `components/site/`): Landing page, `/articles`, `/articles/:slug`, `/news`, `/about` (contact at `#contact`). The admin panel lives under `/admin` (`views/admin/` plus the original dashboard, users and settings views) behind `/login`
- The public site has one fixed look (palette and "night to dawn" sky) in `src/assets/site.css`, scoped to `.fn-site` and kept in `@layer components` so Tailwind utilities win; it ignores `.dark` and the admin themes. Motion: `v-reveal` and `v-tilt` (`src/lib/motion.ts`), `StarField`, `BirthChart`, all respecting `prefers-reduced-motion`
- Public content goes through `src/lib/content.ts`; brand facts and contacts (email, Telegram, WhatsApp) live in `src/lib/site.ts`, an empty contact is hidden. Dates are shown and entered in the Jalali calendar (Tehran time): `lib/site.ts` to display, `lib/jalali.ts` and `components/admin/JalaliDateInput.vue` to enter
- Brand: sources in `docs/reference/brand/`: `logo-final.png` (full logo, all 12 signs) and `icon-final.png` (small mark); `logo-a.png`/`logo-b.png` are superseded drafts. Derived files: `src/assets/brand/logo.webp` (About page), `src/assets/brand/mark.webp` (`components/site/BrandMark.vue`), `public/favicon.png`, `public/apple-touch-icon.png`, `public/og-image.png` (default link preview)
- "ورود به اپلیکیشن" and "شروع کنید" buttons intentionally do nothing until the App exists

## Deployment

- `bin/` (repo root) holds server scripts: `setup.sh` (one-time: bun, node, pm2, serve, Docker), `deploy.sh` (git reset to `origin/<branch>`, `bun install --frozen-lockfile`, `bun run build`, `pm2 startOrReload ecosystem.config.js`), `sync.sh` (rsync alternative to git), `update-deps.sh`, `link-skills.sh` (symlinks every `.agents/skills/<name>` into `.claude/skills/`, prunes broken links; run via `bun run skills:link`, also run by `bun run claude`)
- `ecosystem.config.js` runs `app-backend` (bun, `backend/dist/main.js`, env from `backend/.env`) and `app-frontend` (`serve` of `frontend/dist` on :8080, SPA mode). The frontend calls `/api`, so the reverse proxy must map `/api` to the backend port with the prefix stripped (as Vite does in dev)
- SEO routes (`docs/adr/0001-server-rendered-meta-for-spa.md`): the reverse proxy also maps `/articles/<slug>` to backend `/site/pages/articles/<slug>` and `/sitemap.xml` to `/site/sitemap.xml`; everything else goes to `app-frontend`. Backend env `SITE_URL` and `FRONTEND_INDEX` (see `backend/env.example`)
- Static preview: `.github/workflows/pages.yml` builds only `frontend/` on every push to `main` and publishes it to GitHub Pages at `https://<user>.github.io/<repo>/` (needs Settings > Pages > Source: GitHub Actions once). It has no backend, so news, articles and FAQs are empty there and `/admin` does not work. `vite.config.ts` reads `VITE_BASE` (set to `/<repo>/` by the workflow, default `/`) and the router uses `import.meta.env.BASE_URL`; the build copies `index.html` to `404.html` so deep links work. Locally under Git Bash set `MSYS_NO_PATHCONV=1` when passing `VITE_BASE`
- Uploaded images live in `backend/uploads/` (or `UPLOAD_DIR`) on the server; back it up, deploys keep it because it is gitignored

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature>/` in this repo. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context: root `CONTEXT-MAP.md` points to `backend/CONTEXT.md` and `frontend/CONTEXT.md` (Falaknama vocabulary: Landing page, App, Article, News item, FAQ, Birth chart). System-wide ADRs live in `docs/adr/`, workspace ADRs in `backend/docs/adr/` and `frontend/docs/adr/`. Reference screenshots of the site this design started from are in `docs/reference/zayche/`; the brand name "زایچه" must never appear in Falaknama copy. See `docs/agents/domain.md`.

## Child DOX Index

Partially indexed; add further children as folders become durable boundaries.

- `backend/src/modules/common/AGENTS.md`: shared REST layers, logger, validators and optional integrations (Telegram, Redis, S3, SMS, Pusher, rate limiting)
