import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import React from 'react';
import Footer from '../../components/homepage/footer';
import { getDatabase } from '../../lib/notion';
import { PhotosGrid, photosDatabaseId } from '../index';
import styles from '../index.module.css';

const title = 'hello';
const description = 'hello';

interface IProps {
  photos: QueryDatabaseResponse['results'];
}

export default function Home(props: IProps) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="zamiang" key="twhandle" />

        {/* Open Graph */}
        <meta property="og:url" content="https://www.zamiang.com/photos" key="ogurl" />
        <meta property="og:site_name" content="Zamiang" key="ogsitename" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Photos</h1>
        </header>
        <h2 className={styles.heading}>Photos</h2>
        <PhotosGrid photos={props.photos} />
        <Footer />
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const photos = await getDatabase(photosDatabaseId);

  return {
    props: {
      photos,
    },
    revalidate: 1,
  };
};
