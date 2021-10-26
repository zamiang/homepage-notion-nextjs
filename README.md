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

#### Deploy to vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fsamuelkraft%2Fnotion-blog-nextjs&env=NOTION_TOKEN,NOTION_DATABASE_ID&envDescription=Please%20add%20NOTION_TOKEN%20and%20NOTION_DATABASE_ID%20that%20is%20required%20to%20connect%20the%20blog%20to%20your%20notion%20account.&envLink=https%3A%2F%2Fdevelopers.notion.com%2Fdocs%2Fgetting-started&project-name=notion-blog-nextjs&repo-name=notion-blog-nextjs&demo-title=Notion%20Blog%20Next%20JS&demo-description=%20This%20is%20a%20Next.js%20blog%20using%20Notions%20Public%20API.&demo-url=notion-blog-nextjs-coral.vercel.app)
