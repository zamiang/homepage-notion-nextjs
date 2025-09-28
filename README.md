# Notion Blog with Next.js

This is a [Next.js](https://nextjs.org/) blog written in [TypeScript](https://www.typescriptlang.org/) that integrates with [Notion's Public API](https://developers.notion.com) to fetch and display content. Notion posts are cached so that they are updated when `npm run cache-posts` is run. The project is a fork and enhancement of the [Notion Blog template](https://github.com/thegesturs/notion-blogs) tailored for performance, security, and ease of use.

**Live Site:** [https://www.zamiang.com](https://www.zamiang.com)

---

## 🌟 Key Features

- **High performance due to SSR**: Pages are rendered server-side and are very small all have a 100 score from Vercel's performance dashboard.
- **Sitemap Generation**: Automatically creates a sitemap for SEO optimization.
- **RSS Feed**: Provides an RSS feed for syndication and content aggregation.
- **Content Security Policy (CSP)**: Enhances security by restricting sources of executable scripts, styles, and other resources.
- **Code Quality Tools**: Comes with a robust [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) configuration for consistent, clean code.
- **Photo & Writing Pages**: Separate sections for blog posts and photo galleries, both sourced from Notion.
- **CDN-Backed Images**: Uses [Vercel's Image Optimization](https://vercel.com/docs/concepts/edge-network/image-optimization) for fast, responsive image delivery.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API Integration**: [Notion API](https://developers.notion.com)
- **Image Optimization**: [Vercel Image Component](https://vercel.com/docs/concepts/edge-network/image-optimization)
- **Code Quality**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```
├── public/                # Static assets (images, favicons, etc.)
├── src/                   # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility functions and API integrations
├── __tests__/             # Unit and integration tests
├── scripts/               # Build scripts (e.g., caching Notion data)
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file!
```

---

## 🚀 Getting Started

### 1. **Set Up Notion API Credentials**

Follow the [Notion API Getting Started Guide](https://developers.notion.com/docs/getting-started) to obtain:

- `NOTION_TOKEN`: Your Notion integration token.
- `NOTION_POSTS_DATA_SOURCE_ID`: The data source ID for your blog posts.
- `NOTION_PHOTOS_DATA_SOURCE_ID`: The data source ID for your photo gallery.

Save these in a `.env.local` file:

```env
NOTION_TOKEN=your-notion-token
NOTION_POSTS_DATA_SOURCE_ID=your-posts-data-source-id
NOTION_PHOTOS_DATA_SOURCE_ID=your-photos-data-source-id
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Run the Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.

### 4. **Build and Preview**

```bash
npm run build
npm run preview
```

---

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/):

1. Push your code to a Git repository.
2. Deploy using the [Vercel CLI](https://vercel.com/docs/cli) or [Vercel Dashboard](https://vercel.com/dashboard).
3. Ensure environment variables are set in the Vercel dashboard under "Settings > Environment Variables".

---

## 🧪 Testing

The project includes unit and integration tests using [Vitest](https://vitest.dev/). To run tests:

```bash
npm test
```

Tests are located in the `__tests__` directory and cover core functionality like:

- Notion API data fetching
- Component rendering
- Image optimization

---

## 📌 Customization

- **Themes**: Modify the `tailwind.config.ts` and `postcss.config.mjs` files to customize the design.
- **Notion Content**: Update the Notion databases to reflect new posts or photos.
- **SEO**: Adjust the `next.config.ts` for custom sitemap or meta tags.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE). See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository.
2. Create a feature branch.
3. Make changes and ensure tests pass.
4. Submit a pull request.

For major changes, please open an issue first to discuss what you'd like to add.

---

## 📌 Roadmap

- [ ] Implement a table of contents / maybe a UI revision to better handle posts in series

---

## 🙏 Credits

- Based on [Notion Blog](https://github.com/thegesturs/notion-blogs) by [thegesturs](https://github.com/thegesturs)
- Inspired by [Next.js Blog Examples](https://github.com/vercel/next.js/tree/canary/examples/blog)
