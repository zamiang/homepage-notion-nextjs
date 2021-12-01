import Head from 'next/head';
import React from 'react';
import { useMeasure } from 'react-use';
import { Text } from '../../components/article/text';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { Image, signImageUrl } from '../../components/image/imgix';
import { getBlocks, getItemsFromDatabase, getPageBySlug } from '../../lib/notion';
import { photosDatabaseId } from '../index';
import styles from '../writing/writing.module.css';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type Params = UnPromisify<ReturnType<typeof getStaticProps>>['props'];
type Block = Params['blocks'][0];

export const config = {
  unstable_runtimeJS: false,
};

const renderBlock = (block: Block, width = 720) => {
  const { type } = block;
  const value = (block as any)[type];

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
      const url = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption && value.caption[0] ? value.caption[0].plain_text : '';
      const { src, srcSet } = signImageUrl(url, width, width);
      return (
        <figure>
          <Image
            width={width}
            height={width}
            src={src}
            srcSet={srcSet}
            alt={caption}
            style={{ minHeight: 300 }}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

const Blocks = (props: { blocks: Params['blocks'] }) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  return (
    <div ref={ref}>
      {props.blocks.map((block) => (
        <React.Fragment key={block.id}>
          {renderBlock(block, width < 300 ? undefined : width)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function Post({ page, blocks }: Params) {
  if (!page || !blocks) {
    return <div />;
  }
  const title = (page.properties.Title as any).title[0].plain_text;
  const ogImageUrl = (page.properties.Cover as any)?.files[0]?.file.url;
  const date = new Date((page.properties.Date as any).date?.start as string).toLocaleString(
    'en-US',
    {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    },
  );
  return (
    <div>
      <Head>
        <title>{`${title} by Brennan Moore`}</title>
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} key="ogdesc" />}
      </Head>
      <Header />
      <article className={styles.container} style={{ maxWidth: 720 }}>
        <div className={styles.top}>
          <div className={styles.date}>{date}</div>
          <h1 className={styles.title}>
            <Text text={(page.properties.Title as any).title} />
          </h1>
          <div className={styles.shortLine}></div>
        </div>
        <section>
          <Blocks blocks={blocks} />
        </section>
      </article>
      <Footer />
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getItemsFromDatabase(photosDatabaseId);
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

  return {
    props: {
      page,
      blocks,
    },
    revalidate: 1,
  };
};
