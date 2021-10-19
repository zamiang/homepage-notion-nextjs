import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Footer from '../components/homepage/footer';
import Header from '../components/homepage/header';
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

export const PhotosGrid = (props: { photos: QueryDatabaseResponse['results'] }) => {
  const orderedPhotos = props.photos.sort((a, b) =>
    new Date((a.properties.Date as any).date?.start as string) >
    new Date((b.properties.Date as any).date?.start as string)
      ? -1
      : 1,
  );
  return (
    <div className={styles.grid}>
      {orderedPhotos.map((post) => {
        const title = (post.properties.Title as any).title;
        const src = (post.properties.Cover as any)?.files[0]?.file.url;
        const slug = (post.properties.Slug as any).rich_text[0]?.plain_text;

        return (
          <div key={post.id} className={styles.gridItem}>
            {src && (
              <Link href={`/photos/${slug}`}>
                <a>
                  <Image src={src} width="342" height="342" />
                </a>
              </Link>
            )}
            <h3>
              <Link href={`/photos/${slug}`}>
                <a className={styles.postTitle}>
                  <Text text={title} />
                </a>
              </Link>
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export const PostsList = (props: { posts: QueryDatabaseResponse['results'] }) => {
  const orderedPosts = props.posts.sort((a, b) =>
    new Date((a.properties.Date as any).date?.start as string) >
    new Date((b.properties.Date as any).date?.start as string)
      ? -1
      : 1,
  );

  return (
    <div className={styles.posts}>
      {orderedPosts.map((post) => {
        const date = new Date((post.properties.Date as any).date.start as string).toLocaleString(
          'en-US',
          {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          },
        );

        const title = (post.properties.Title as any).title;
        const excerpt = (post.properties.Excerpt as any).rich_text[0]?.plain_text;
        const slug = (post.properties.Slug as any).rich_text[0]?.plain_text;
        return (
          <div key={post.id} className={styles.post}>
            <div className={styles.postDate}>{date}</div>
            <div className={styles.postHeading}>
              <Link href={`/writing/${slug}`}>
                <a className={styles.postTitle}>
                  <Text text={title} />
                </a>
              </Link>
            </div>
            <div className={styles.postExcerpt}>{excerpt}</div>
          </div>
        );
      })}
    </div>
  );
};

export default function Home(props: IProps) {
  const posts = props.posts.filter(
    (p) =>
      (p.properties.Status as any).select?.name === 'Live' &&
      (p.properties['Featured on homepage'] as any).select?.name === 'Featured',
  );

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="zamiang" key="twhandle" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for zamiang.com"
          href="/rss.xml"
        />

        {/* Open Graph */}
        <meta property="og:url" content="https://www.zamiang.com" key="ogurl" />
        <meta property="og:site_name" content="Kelp" key="ogsitename" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      <main className={styles.container}>
        <Header />
        <article>
          <header className={styles.header}>
            <Image src="/about.jpg" height="171" width="256" />
            <h1>
              Hi, I’m Brennan.
              <br />I build innovative digital products people love.
            </h1>
          </header>
          <div className={styles.section}>
            <p className={styles.homepageText}>
              Over the past 12 years, I&lsquo;ve built web-based tools for non-profits, art
              collectors, bike shares, e-commerce companies. Some examples:
            </p>
            <ul>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://kelp.nyc/">Kelp</a>
                </div>
                <div className={styles.listBody}>
                  Your information filtration system. Kelp serves you relevant documents and
                  webpages when you need them.
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://www.cityblock.com/">Cityblock Health</a>
                </div>
                <div className={styles.listBody}>
                  I was a founding team member helping build a scalable solution to address the root
                  causes of health for underserved urban populations. I ran the engineering team.
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://www.motivateco.com/">Motivate</a>
                </div>
                <div className={styles.listBody}>
                  I lead the engineering team through first successful PCI compliance for Citi Bike.
                  I also managed all in-house and contractor software development for the ~10 bike
                  shares Motivate ran around the world.
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="http://www.vislet.com/">Vislet</a>
                </div>
                <div className={styles.listBody}>
                  A set of small interactive visualizations to help us understand the cities we live
                  in.
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://artsy.net/">Artsy</a>
                </div>
                <div className={styles.listBody}>
                  I ran the team responsible for making sure Artsy’s public facing web presence is
                  fast and maintainable and that out custom tools for live events such as art fairs
                  and auction worked well.
                </div>
              </li>
            </ul>
          </div>
          <div className={styles.section}>
            <h2 className={styles.heading}>Writing</h2>
            <PostsList posts={posts} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.heading}>Photos</h2>
            <PhotosGrid photos={props.photos} />
          </div>
        </article>
        <Footer />
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
