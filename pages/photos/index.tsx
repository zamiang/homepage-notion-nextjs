import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import React from 'react';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { saveImagesForDatabase } from '../../components/image/download-image';
import { getItemsFromDatabase } from '../../lib/notion';
import { PhotosGrid, baseUrl, photosDatabaseId } from '../index';
import styles from '../index.module.css';

const title = 'Photos - Brennan Moore';
const description = 'List of photos';
const pageId = 'photos';

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
        <meta property="og:url" content={`${baseUrl}/photos`} key="ogurl" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      <main>
        <Header />
        <article>
          <header className={styles.header}>
            <h1>Photos</h1>
            <div className={styles.shortLine}></div>
          </header>
          <PhotosGrid photos={props.photos} pageId={pageId} />
        </article>
        <Footer />
      </main>
    </div>
  );
}

export const config = {
  unstable_runtimeJS: false,
  unstable_JsPreload: false,
};

export const getStaticProps = async () => {
  const photos = await getItemsFromDatabase(photosDatabaseId);
  await saveImagesForDatabase(photos, pageId);
  return {
    props: {
      photos,
    },
    revalidate: false,
  };
};
