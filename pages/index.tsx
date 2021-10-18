import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getDatabase } from '../lib/notion';
import styles from './index.module.css';
import { Text } from './writing/[id]';

export const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID!;
export const photosDatabaseId = process.env.NOTION_PHOTOS_DATABASE_ID!;

const title = 'hello';
const description = 'hello';

interface IProps {
  photos: QueryDatabaseResponse['results'];
  posts: QueryDatabaseResponse['results'];
}

export default function Home(props: IProps) {
  const orderedPhotos = props.photos.sort((a, b) =>
    new Date((a.properties.Date as any).date?.start) >
    new Date((b.properties.Date as any).date?.start)
      ? -1
      : 1,
  );

  const orderedPosts = props.posts
    .filter(
      (p) =>
        (p.properties.Status as any).select?.name === 'Live' &&
        (p.properties['Featured on homepage'] as any).select?.name === 'Featured',
    )
    .sort((a, b) =>
      new Date((a.properties.Date as any).date?.start) >
      new Date((b.properties.Date as any).date?.start)
        ? -1
        : 1,
    );

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="zamiang" key="twhandle" />

        {/* Open Graph */}
        <meta property="og:url" content="https://www.zamiang.nyc" key="ogurl" />
        <meta property="og:site_name" content="Kelp" key="ogsitename" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Next.js blog powered by Notion API</h1>
          <p>
            This is an example of a Next.js blog with data fetched with Notions API. The data comes
          </p>
        </header>
        <h2 className={styles.heading}>All Posts</h2>
        <ul className={styles.posts}>
          {orderedPosts.map((post) => {
            const date = new Date((post.properties.Date as any).date.start).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              },
            );

            const title = (post.properties.Title as any).title;
            const excerpt = (post.properties.Excerpt as any).rich_text[0]?.plain_text;
            return (
              <li key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/writing/${post.id}`}>
                    <a>
                      <Text text={title} />
                    </a>
                  </Link>
                </h3>
                <p className={styles.postDescription}>{date}</p>
                <p className={styles.postExcerpt}>{excerpt}</p>
              </li>
            );
          })}
        </ul>
        <h2 className={styles.heading}>Photos</h2>
        <ul className={styles.posts}>
          {orderedPhotos.map((post) => {
            const date = new Date((post.properties.Date as any).date.start).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              },
            );

            const title = (post.properties.Title as any).title;
            const src = (post.properties.Cover as any)?.files[0]?.file.url;

            return (
              <li key={post.id} className={styles.post}>
                {src && (
                  <Link href={`/photos/${post.id}`}>
                    <Image src={src} width="331" height="331" />
                  </Link>
                )}
                <h3 className={styles.postTitle}>
                  <Link href={`/photos/${post.id}`}>
                    <a>
                      <Text text={title} />
                    </a>
                  </Link>
                </h3>
                <p className={styles.postDescription}>{date}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await getDatabase(postsDatabaseId);
  const photos = await getDatabase(photosDatabaseId);

  return {
    props: {
      posts,
      photos,
    },
    revalidate: 1,
  };
};
