# Notion Blog with Next.js

A high-performance [Next.js 16](https://nextjs.org/) blog written in [TypeScript](https://www.typescriptlang.org/) that uses [Notion's Public API](https://developers.notion.com) as a headless CMS. Features Turbopack builds, 75% test coverage, optimized images with WebP/AVIF support, and comprehensive SEO with JSON Feed and Schema.org structured data.

**Live Site:** [https://brennanmoore.com](https://brennanmoore.com)

[![Tests](https://img.shields.io/badge/tests-221%20passing-brightgreen)]()
[![Coverage](https://img.shields.io/badge/coverage-75.79%25-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)]()

---

## 🌟 Key Features

### Performance & Build
- **⚡ Turbopack Builds**: 1.7s production builds with Next.js 16's default Turbopack compiler
- **📊 Static Generation**: 38 pages pre-rendered at build time for instant loading
- **🖼️ Image Optimization**: WebP/AVIF support with responsive sizing (40-60% bandwidth reduction)
- **💯 Perfect Scores**: Consistently scores 100 on Vercel's performance dashboard

### SEO & Discovery
- **🔍 Multi-Format Feeds**:
  - RSS 2.0 feed (`/rss.xml`) for traditional feed readers
  - JSON Feed 1.1 (`/feed.json`) with full content and word counts
  - Auto-discovery links in HTML for easy subscription
- **📋 Schema.org JSON-LD**: Rich structured data with Person, Blog, BlogPosting, and Photograph types
- **🗺️ Dynamic Sitemap**: Auto-generated with priority and change frequency
- **📱 Social Metadata**: OpenGraph and Twitter Card support

### Developer Experience
- **✅ 75% Test Coverage**: 221 comprehensive tests with Vitest and React Testing Library
- **🎯 Type Safety**: Strict TypeScript with full type coverage
- **🔒 Security**: Content Security Policy (CSP) and secure headers
- **📚 Well-Documented**: Comprehensive docs in `/docs` and inline comments
- **🎨 Code Quality**: ESLint 9, Prettier, and automated formatting

### Content Management
- **📝 Notion as CMS**: Easy content management through Notion's intuitive interface
- **💾 Smart Caching**: Local JSON caching for fast builds and offline development
- **📸 Dual Content Types**: Separate sections for blog posts and photo galleries
- **🏷️ Series Support**: VBC (Value-Based Care) series with navigation

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 16.0.0 | App Router with Turbopack |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Type-safe development |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.1.14 | Utility-first CSS (v4 with Lightning CSS) |
| **CMS** | [Notion API](https://developers.notion.com) | 5.3.0 | Content management |
| **Testing** | [Vitest](https://vitest.dev/) | 4.0.2 | Fast unit testing |
| **Testing** | [React Testing Library](https://testing-library.com/react) | Latest | Component testing |
| **Code Quality** | [ESLint](https://eslint.org/) | 9.38.0 | Code linting |
| **Deployment** | [Vercel](https://vercel.com/) | N/A | Edge deployment |

**Runtime**: Node.js 22.x (minimum 20.9.0 for Next.js 16)

---

## 📁 Project Structure

```
homepage-notion-nextjs/
├── src/
│   ├── app/                      # Next.js 16 App Router
│   │   ├── writing/[slug]/      # Blog post pages
│   │   ├── photos/[slug]/       # Photo gallery pages
│   │   ├── feed.json/           # JSON Feed 1.1 route
│   │   ├── rss.xml/             # RSS 2.0 feed route
│   │   ├── sitemap.xml/         # Dynamic sitemap
│   │   └── robots.txt/          # Robots.txt route
│   ├── components/              # React components
│   │   ├── post-card.tsx        # Blog post card
│   │   ├── photo-card.tsx       # Photo gallery card
│   │   ├── post-layout.tsx      # Shared post layout
│   │   └── mdx-component.tsx    # MDX content renderer
│   ├── lib/                     # Utilities & integrations
│   │   ├── notion.ts            # Notion API client (v5.x)
│   │   ├── config.ts            # Environment config
│   │   ├── errors.ts            # Error handling utilities
│   │   └── page-utils.ts        # SEO and metadata helpers
│   └── hooks/                   # Custom React hooks
├── __tests__/                   # Vitest tests (221 tests)
│   ├── app/                     # Route tests
│   ├── components/              # Component tests
│   └── lib/                     # Utility tests
├── scripts/
│   └── cache-posts.ts           # Notion content caching
├── docs/                        # Project documentation
├── posts-cache.json             # Cached blog posts
├── photos-cache.json            # Cached photos
├── public/images/               # Optimized images
├── CLAUDE.md                    # AI context & patterns
└── README.md                    # This file
```

---

## 🚀 Getting Started

### 1. Set Up Notion API Credentials

Follow the [Notion API Getting Started Guide](https://developers.notion.com/docs/getting-started) to create an integration and obtain:

- `NOTION_TOKEN`: Your Notion integration token (starts with `secret_`)
- `NOTION_POSTS_DATABASE_ID`: Database ID for blog posts (data source ID)
- `NOTION_PHOTOS_DATABASE_ID`: Database ID for photo gallery (data source ID)
- `SITE_URL`: Your site URL for absolute links (e.g., `https://brennanmoore.com`)

**Important**: Use Notion **data source IDs** (v5.x API), not database IDs.

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NOTION_TOKEN=secret_your-notion-integration-token
NOTION_POSTS_DATABASE_ID=abc123def456
NOTION_PHOTOS_DATABASE_ID=xyz789abc123
SITE_URL=https://brennanmoore.com
```

### 3. Install Dependencies

```bash
npm install
```

**System Requirements**: Node.js 20.9.0 or higher

### 4. Cache Content from Notion

Before running the dev server, cache your Notion content:

```bash
npm run cache:posts
```

This creates `posts-cache.json` and `photos-cache.json` for faster builds.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your blog.

**Dev Features**:
- ⚡ Turbopack for instant HMR (Hot Module Replacement)
- 🔄 Fast refresh on file changes
- 🛠️ TypeScript type checking in real-time

### 6. Build for Production

```bash
npm run build   # Build with Turbopack (1.7s)
npm start       # Start production server
```

**Build Output**: 38 static pages generated at build time for optimal performance.

---

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/):

1. Push your code to a Git repository.
2. Deploy using the [Vercel CLI](https://vercel.com/docs/cli) or [Vercel Dashboard](https://vercel.com/dashboard).
3. Ensure environment variables are set in the Vercel dashboard under "Settings > Environment Variables".

---

## 🧪 Testing

The project has **75.79% test coverage** with **221 comprehensive tests** using [Vitest](https://vitest.dev/) and React Testing Library.

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
| **Components** | High | 66 tests (PostCard, PhotoCard, VBCFooter, etc.) |
| **Utilities** | High | 48 tests (config, errors, page-utils) |
| **API Routes** | Complete | 42 tests (RSS, JSON Feed, sitemap) |
| **Hooks** | Complete | 7 tests (use-mobile) |
| **Integration** | Good | 58 tests (pages, layouts) |

**Key Test Features**:
- Type-safe mocking with `vi.mocked()`
- Timezone-safe date assertions
- Behavioral testing (not implementation details)
- Snapshot testing for UI consistency

See [CLAUDE.md](CLAUDE.md) for testing patterns and conventions.

---

## 📌 Customization

### Design & Styling
- **Colors & Typography**: Edit `tailwind.config.ts` for theme customization
- **Layout**: Modify components in `src/components/` for structural changes
- **Images**: Configure quality and formats in `next.config.ts` under `images`

### Content
- **Notion Databases**: Update your Notion pages to add posts or photos
- **Sections**: Modify `src/lib/notion.ts` to add new content sections
- **Metadata**: Edit `src/lib/page-utils.ts` for SEO and Schema.org customization

### SEO & Feeds
- **Sitemap**: Configure priorities in `src/app/sitemap.xml/route.ts`
- **RSS Feed**: Customize feed details in `src/app/rss.xml/route.ts`
- **JSON Feed**: Modify `src/app/feed.json/route.ts` for feed customization

### Performance
- **Image Quality**: Adjust `qualities` array in `next.config.ts` (default: `[75, 85]`)
- **Cache TTL**: Modify `minimumCacheTTL` in `next.config.ts` (default: 30 days)
- **Caching Strategy**: Update `scripts/cache-posts.ts` for different caching behavior

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[CLAUDE.md](CLAUDE.md)**: AI context, patterns, and conventions (start here!)
- **[Code Quality Audit](docs/CODE_QUALITY_AUDIT_2025-10-23.md)**: Test coverage and quality metrics
- **[Next.js 16 Upgrade](docs/NEXTJS_16_UPGRADE_COMPLETED_2025-10-23.md)**: Breaking changes and migration guide
- **[Image Optimization](docs/IMAGE_OPTIMIZATION_PLAN.md)**: Performance optimization strategies
- **[Dependency Updates](docs/DEPENDENCY_UPDATES_PLAN_2025-10-23.md)**: Package update strategy

---

## 🐛 Troubleshooting

### Common Issues

**Image Quality Warnings**
```
Image with src "..." is using quality "85" which is not configured
```
**Solution**: Add `qualities: [75, 85]` to `images` config in `next.config.ts`

**Notion API Errors**
- Ensure using Notion API v5.x with `dataSources.query()` not `databases.query()`
- Verify `data_source_id` (not `database_id`) in environment variables
- Check integration has access to your Notion pages

**Build Failures**
- Run `npm run cache:posts` before building
- Ensure Node.js version is 20.9.0 or higher
- Clear `.next` cache: `rm -rf .next && npm run build`

See [CLAUDE.md](CLAUDE.md#troubleshooting--known-issues) for more troubleshooting tips.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Next.js 16](https://nextjs.org/) by Vercel
- Based on [Notion Blog](https://github.com/thegesturs/notion-blogs) by [thegesturs](https://github.com/thegesturs)
- Powered by [Notion's Public API](https://developers.notion.com)
- Testing with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/)

---

**Made with ❤️ using Next.js and Notion**
