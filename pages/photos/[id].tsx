import Head from 'next/head';
import React from 'react';
import { useMeasure } from 'react-use';
import { Text } from '../../components/article/text';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { saveImagesForBlocks } from '../../components/image/download-image';
import { Image } from '../../components/image/image';
import { getBlocks, getItemsFromDatabase, getPageBySlug } from '../../lib/notion';
import { photosDatabaseId } from '../index';
import styles from '../writing/writing.module.css';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export type Params = UnPromisify<ReturnType<typeof getStaticProps>>['props'];
type Block = Params['blocks'][0];

const renderBlock = (block: Block, pageId: string, width = 720, heightMultipleOfWidth: number) => {
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
      const caption =
        value.caption && value.caption[0] && value.caption[0].plain_text
          ? value.caption[0].plain_text
          : '';
      const captionHref = value.caption && value.caption[0]?.href;

      return (
        <figure style={{ width }}>
          <Image
            width={width}
            height={width * heightMultipleOfWidth}
            src={url}
            alt={caption}
            pageId={pageId}
          />
          {caption && captionHref && (
            <figcaption>
              <a href={captionHref}>{caption}</a>
            </figcaption>
          )}
          {caption && !captionHref && <figcaption>{caption}</figcaption>}
        </figure>
      );
    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};

const Blocks = (props: {
  blocks: Params['blocks'];
  pageId: string;
  isGrid: boolean;
  heightMultipleOfWidth: number;
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  if (props.isGrid) {
    return (
      <div className={styles.grid}>
        {props.blocks.map((block, index) => (
          <div className={styles.gridItem} key={block.id} ref={index === 0 ? ref : undefined}>
            {renderBlock(
              block,
              props.pageId,
              width < 300 ? undefined : width,
              props.heightMultipleOfWidth,
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref}>
      {props.blocks.map((block) => (
        <React.Fragment key={block.id}>
          {renderBlock(
            block,
            props.pageId,
            width < 300 ? undefined : width,
            props.heightMultipleOfWidth,
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default function Post({ page, blocks, id }: Params) {
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
  const name = (page.properties.Grid as any)?.select?.name;

  const isGrid = name === 'two-column' || name === 'two-column-wide';
  return (
    <div>
      <Head>
        <title>{`${title} by Brennan Moore`}</title>
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} key="ogdesc" />}
      </Head>
      <Header />
      <article className={styles.container} style={{ maxWidth: isGrid ? 1280 : 720 }}>
        <div className={styles.top}>
          <div className={styles.date}>{date}</div>
          <h1 className={styles.title}>
            <Text text={(page.properties.Title as any).title} />
          </h1>
          <div className={styles.shortLine}></div>
        </div>
        <section>
          <Blocks
            blocks={blocks}
            isGrid={isGrid}
            pageId={id}
            heightMultipleOfWidth={name === 'two-column-wide' ? 2 / 3 : 1}
          />
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
    fallback: false,
  };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  const { id } = context.params;
  const page = await getPageBySlug(id, photosDatabaseId);
  const blocks = await getBlocks(page.id);
  await saveImagesForBlocks(blocks, id);

  return {
    props: {
      page,
      blocks,
      id,
    },
    revalidate: false,
  };
};
