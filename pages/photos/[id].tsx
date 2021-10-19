import Head from 'next/head';
import Image from 'next/image';
import React, { Fragment } from 'react';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { getBlocks, getDatabase, getPageBySlug } from '../../lib/notion';
import { photosDatabaseId } from '../index';
import { Text } from '../writing/[id]';
import styles from '../writing/writing.module.css';

const renderBlock = (block: any) => {
  const { type } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p>
          <Text text={value.text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1>
          <Text text={value.text} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <Text text={value.text} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <Text text={value.text} />
        </h3>
      );
    case 'child_page':
      return <p>{value.title}</p>;
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption && value.caption[0] ? value.caption[0].plain_text : '';
      return (
        <figure>
          <Image src={src} alt={caption} height="680" width="680" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

export default function Post({ page, blocks }: any) {
  if (!page || !blocks) {
    return <div />;
  }
  const src = page.properties.Cover?.files[0]?.file.url;
  const date = new Date(page.properties.Date.date.start as string).toLocaleString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  return (
    <div>
      <Head>
        <title>{page.properties.Title.title[0].plain_text}</title>
        {src && <meta property="og:image" content={src} key="ogdesc" />}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <article className={styles.container}>
        <div className={styles.top}>
          <h1 className={styles.name}>
            <Text text={page.properties.Title.title} />
          </h1>
          <div className={styles.date}>{date}</div>
          <div className={styles.divider}></div>
        </div>
        <section>
          {blocks.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
      </article>
      <Footer />
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(photosDatabaseId);
  const paths = database
    .map((post) => {
      const slug = (post.properties.Slug as any).rich_text[0]?.plain_text;
      if (slug) {
        return { params: { id: slug } };
      }
    })
    .filter(Boolean);
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  const { id } = context.params;
  const page = await getPageBySlug(id, photosDatabaseId);
  const blocks = await getBlocks(page.id);

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => ({
        id: block.id,
        children: await getBlocks(block.id),
      })),
  );
  const blocksWithChildren = blocks.map((block: any) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find((x) => x.id === block.id)?.children;
    }
    return block;
  });

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  };
};
