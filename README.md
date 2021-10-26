This is a [Next.js](https://nextjs.org/) blog using [Notions Public API](https://developers.notion.com) written in typescript.

**Demo:** [https://www.zamiang.com](https://www.zamiang.com)

**Based on:** [https://samuelkraft.com/blog/building-a-notion-blog-with-public-api](https://samuelkraft.com/blog/building-a-notion-blog-with-public-api)

## Features

- Sitemap
- RSS feed
- Google analytics
- Content security policy
- Robust eslint and prettier config
- Supports all notion blocks current supported by the API (I think?)
- Supports both photos and writing

## Getting Started

First, follow Notions [getting started guide](https://developers.notion.com/docs/getting-started) to get a `NOTION_TOKEN`, `NOTION_POSTS_ID` and `NOTION_PHOTOS_ID, then add them to a file called `.env.local`.

```
NOTION_TOKEN=
NOTION_POSTS_DATABASE_ID=
NOTION_PHOTOS_DATABASE_ID=
GOOGLE_ANALYTICS_ID=
```

Install dependencies

```bash
npm install
```

Start the server with

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
