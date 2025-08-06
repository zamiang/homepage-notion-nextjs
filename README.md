This is a [Next.js](https://nextjs.org/) blog written in Typescript that uses [Notion's Public API](https://developers.notion.com).

Production: [https://www.zamiang.com](https://www.zamiang.com)

Orignally based on (Notion Blog)[https://github.com/thegesturs/notion-blogs]

## Features

- Sitemap
- RSS feed
- Content Security Policy (CSP)
- Robust eslint and prettier config
- Pages for photos and writing
- CDN backed images using vercel

## Getting Started

First, follow the Notion API [getting started guide](https://developers.notion.com/docs/getting-started) to get a `NOTION_TOKEN`, `NOTION_POSTS_DATABASE_ID` and `NOTION_PHOTOS_DATABASE_ID`. Add them all to a file called `.env.local`.

```
NOTION_TOKEN=
NOTION_POSTS_DATABASE_ID=
NOTION_PHOTOS_DATABASE_ID=
```

Install dependencies:

```bash
npm install
```

Start the server with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
