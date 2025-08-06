# System Patterns

The system is designed around a headless architecture, with Notion serving as the content management system (CMS).

- **Frontend**: A Next.js application is responsible for fetching data from the Notion API and rendering the website.
- **Data Fetching**: The application uses the Notion API to retrieve blog posts and photos. It's likely that there are specific scripts or server-side functions to handle this data fetching and caching (e.g., `scripts/cache-posts.ts`).
- **Content Display**: The fetched content is rendered into pages for "writing" and "photos". The photo gallery has a specific two-column layout.
