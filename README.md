# Notion Blog with Astro

A high-performance [Astro 5](https://astro.build/) blog written in [TypeScript](https://www.typescriptlang.org/) that uses [Notion's Public API](https://developers.notion.com) as a headless CMS. Features static site generation, React islands for interactivity, optimized images, and comprehensive SEO with sitemap, RSS, JSON Feed and Schema.org structured data.

**Live Site:** [https://brennanmoore.com](https://brennanmoore.com)

[![Tests](https://img.shields.io/badge/tests-306%20passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-76.9%25-green)]()
[![Astro](https://img.shields.io/badge/Astro-5.16-purple)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)]()

---

## Key Features

### Performance & Build
- **Static Site Generation**: 34 pages pre-rendered at build time for instant loading
- **Islands Architecture**: React components only where needed (particles, mobile menu)
- **Zero JS by Default**: Content pages ship no JavaScript except for interactive islands
- **Cloudflare Pages**: Deployed to Cloudflare's edge network for global performance

### SEO & Discovery
- **Multi-Format Feeds**:
  - RSS 2.0 feed (`/rss.xml`) for traditional feed readers
  - JSON Feed 1.1 (`/feed.json`) with full content and word counts
  - Auto-discovery links in HTML for easy subscription
- **Schema.org JSON-LD**: Rich structured data with Person, Blog, BlogPosting, and Photograph types
- **Dynamic Sitemap**: Auto-generated with `@astrojs/sitemap`
- **Social Metadata**: OpenGraph and Twitter Card support

### Developer Experience
- **76% Test Coverage**: 306 comprehensive tests with Vitest and React Testing Library
- **Type Safety**: Strict TypeScript with full type coverage
- **Security**: Content Security Policy (CSP) and secure headers via `_headers`
- **Code Quality**: ESLint with Astro plugin, Prettier with Astro support

### Content Management
- **Notion as CMS**: Easy content management through Notion's intuitive interface
- **Content Collections**: Astro's content layer with custom Notion loader
- **Dual Content Types**: Separate collections for blog posts and photo galleries
- **Series Support**: VBC (Value-Based Care) series with navigation

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | [Astro](https://astro.build/) | 5.16.11 | Static site generation with islands |
| **UI** | [React](https://react.dev/) | 19.2.3 | Interactive island components |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type-safe development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.18 | Utility-first CSS (v4 with Vite plugin) |
| **CMS** | [Notion API](https://developers.notion.com) | 5.7.0 | Content management |
| **Testing** | [Vitest](https://vitest.dev/) | 4.0.17 | Fast unit testing |
| **Testing** | [React Testing Library](https://testing-library.com/react) | Latest | Component testing |
| **Code Quality** | [ESLint](https://eslint.org/) | 9.39.2 | Code linting with Astro plugin |
| **Deployment** | [Cloudflare Pages](https://pages.cloudflare.com/) | N/A | Edge deployment |

**Runtime**: Node.js 24.x

---

## Project Structure

```
brennanmoore-astro-blog/
├── src/
│   ├── pages/                    # Astro pages
│   │   ├── index.astro          # Homepage
│   │   ├── writing/[slug].astro # Blog post pages
│   │   ├── photos/[slug].astro  # Photo gallery pages
│   │   ├── feed.json.ts         # JSON Feed 1.1 endpoint
│   │   └── rss.xml.ts           # RSS 2.0 feed endpoint
│   ├── layouts/                  # Astro layouts
│   │   ├── BaseLayout.astro     # HTML shell with head/body
│   │   └── PostLayout.astro     # Blog post layout
│   ├── components/               # UI components
│   │   ├── *.astro              # Static Astro components
│   │   ├── islands/             # React island components
│   │   │   ├── FloatingParticles.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ContentRenderer.tsx
│   │   └── ui/                  # Shared UI components
│   ├── content/                  # Content Collections
│   │   └── config.ts            # Collection schemas & Notion loader
│   ├── lib/                      # Utilities
│   │   ├── notion-loader.ts     # Custom Notion content loader
│   │   ├── config.ts            # Site configuration
│   │   └── utils.ts             # Shared utilities
│   ├── hooks/                    # React hooks (for islands)
│   └── styles/
│       └── globals.css          # Global styles & Tailwind
├── __tests__/                    # Vitest tests (306 tests)
├── public/
│   ├── images/                  # Static images
│   ├── _headers                 # Cloudflare security headers
│   └── _redirects               # Cloudflare redirects
├── astro.config.mjs             # Astro configuration
├── eslint.config.mjs            # ESLint flat config with Astro
├── CLAUDE.md                    # AI context & patterns
└── README.md                    # This file
```

---

## Getting Started

### 1. Set Up Notion API Credentials

Follow the [Notion API Getting Started Guide](https://developers.notion.com/docs/getting-started) to create an integration and obtain:

- `NOTION_TOKEN`: Your Notion integration token (starts with `secret_`)
- `NOTION_DATA_SOURCE_ID`: Data source ID for blog posts
- `NOTION_PHOTOS_DATA_SOURCE_ID`: Data source ID for photo gallery
- `SITE_URL`: Your site URL for absolute links (e.g., `https://brennanmoore.com`)

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
NOTION_TOKEN=secret_your-notion-integration-token
NOTION_DATA_SOURCE_ID=abc123def456
NOTION_PHOTOS_DATA_SOURCE_ID=xyz789abc123
SITE_URL=https://brennanmoore.com
```

### 3. Install Dependencies

```bash
npm install
```

**System Requirements**: Node.js 24.x

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view your blog.

**Dev Features**:
- Hot Module Replacement with Vite
- Content syncs from Notion on startup
- TypeScript type checking

### 5. Build for Production

```bash
npm run build    # Build static site
npm run preview  # Preview production build locally
```

**Build Output**: 34 static pages generated in the `dist/` directory.

---

## Deployment (Cloudflare Pages)

This project is configured for deployment on [Cloudflare Pages](https://pages.cloudflare.com/):

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Log into the Cloudflare dashboard and go to **Workers & Pages**
3. Click **Create** > **Pages** > Connect your repository
4. Configure build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Add environment variables in the Cloudflare dashboard
6. Deploy!

### Security Headers

Security headers are configured in `public/_headers`:
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Cache headers for images and feeds

---

## Testing

The project has **76.9% test coverage** with **306 comprehensive tests** using [Vitest](https://vitest.dev/) and React Testing Library.

### Run Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode for development
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage report
```

### Test Coverage

| Category | Coverage | Tests |
|----------|----------|-------|
| **Components** | High | React islands and UI components |
| **Utilities** | High | config, errors, toc, utils |
| **API Routes** | Complete | RSS, JSON Feed |
| **Hooks** | Complete | use-mobile, use-particles |

See [CLAUDE.md](CLAUDE.md) for testing patterns and conventions.

---

## Customization

### Design & Styling
- **Colors & Typography**: Edit CSS custom properties in `src/styles/globals.css`
- **Layout**: Modify Astro components in `src/layouts/` and `src/components/`

### Content
- **Notion Databases**: Update your Notion pages to add posts or photos
- **Collections**: Modify `src/content/config.ts` for collection schemas
- **Loader**: Customize `src/lib/notion-loader.ts` for content processing

### SEO & Feeds
- **Sitemap**: Configured via `@astrojs/sitemap` in `astro.config.mjs`
- **RSS Feed**: Customize `src/pages/rss.xml.ts`
- **JSON Feed**: Modify `src/pages/feed.json.ts`

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Astro type checking |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |

---

## Troubleshooting

### Common Issues

**Content Not Loading**
- Ensure Notion integration has access to your databases
- Check that environment variables are set correctly
- Run `npm run build` to sync content from Notion

**Build Failures**
- Ensure Node.js version is 24.x
- Clear Astro cache: `rm -rf .astro dist && npm run build`

**Hydration Issues**
- Check for mismatches between server and client rendering
- Ensure React islands use `client:` directives correctly

See [CLAUDE.md](CLAUDE.md#troubleshooting--known-issues) for more troubleshooting tips.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- Built with [Astro](https://astro.build/)
- Powered by [Notion's Public API](https://developers.notion.com)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
- Testing with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/)

---

**Made with Astro and Notion**
