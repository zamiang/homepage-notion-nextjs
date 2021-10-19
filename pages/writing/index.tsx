import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import React from 'react';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { getDatabase } from '../../lib/notion';
import { PostsList, postsDatabaseId } from '../index';
import styles from '../index.module.css';

const title = 'hello';
const description = 'hello';

interface IProps {
  posts: QueryDatabaseResponse['results'];
}

export default function Home(props: IProps) {
  const posts = props.posts.filter((p) => (p.properties.Status as any).select?.name === 'Live');
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
        <meta property="og:url" content="https://www.zamiang.com/writing" key="ogurl" />
        <meta property="og:site_name" content="Zamiang" key="ogsitename" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      <main className={styles.container}>
        <Header />
        <article>
          <header className={styles.header}>
            <h1>Writing</h1>
            <div className={styles.shortLine}></div>
          </header>
          <PostsList posts={posts} />
        </article>
        <Footer />
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await getDatabase(postsDatabaseId);

  return {
    props: {
      posts,
    },
    revalidate: 1,
  };
};
