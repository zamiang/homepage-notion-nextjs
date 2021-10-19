import Head from 'next/head';
import React, { Fragment } from 'react';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { getBlocks, getDatabase, getPage } from '../../lib/notion';
import { postsDatabaseId } from '../index';
import styles from './writing.module.css';

interface IText {
  type: 'text';
  text: {
    content: string;
    link?: string;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: 'default';
  };
  plain_text: string;
  href?: string;
}

export const Text = (props: { text?: IText[] }) => {
  if (!props.text) {
    return null;
  }
  return (
    <React.Fragment>
      {props.text.map((value: any, index: number) => {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          text,
        } = value;
        if (!text) {
          return null;
        }
        return (
          <span
            key={index}
            className={[
              bold ? styles.bold : '',
              code ? styles.code : '',
              italic ? styles.italic : '',
              strikethrough ? styles.strikethrough : '',
              underline ? styles.underline : '',
            ].join(' ')}
            style={color !== 'default' ? { color } : {}}
          >
            {text.link ? <a href={`/writing/${text.link.url}`}>{text.content}</a> : text.content}
          </span>
        );
      })}
    </React.Fragment>
  );
};

const renderBlock = (block: any) => {
  const { type, id } = block;
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
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li>
          <Text text={value.text} />
        </li>
      );
    case 'divider':
      return <div className={styles.divider}>· · ·</div>;

    case 'to_do':
      return (
        <div>
          <label htmlFor={id}>
            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
            <Text text={value.text} />
          </label>
        </div>
      );
    case 'toggle':
      return (
        <details>
          <summary>
            <Text text={value.text} />
          </summary>
          {value.children?.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </details>
      );
    case 'child_page':
      return <p>{value.title}</p>;
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption && value.caption[0] ? value.caption[0].plain_text : '';
      return (
        <figure>
          <img src={src} alt={caption} />
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
  const excerpt = page.properties.Excerpt.rich_text[0]?.plain_text;
  const title = page.properties.Title.title[0].plain_text;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
        <meta property="og:description" content={excerpt} key="ogdesc" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <article className={styles.container}>
        <h1 className={styles.name}>
          <Text text={page.properties.Title.title} />
        </h1>
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
  const database = await getDatabase(postsDatabaseId);
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
  const { id } = context.params;
  const page = await getPage(id);
  const blocks = await getBlocks(id);

  return {
    props: {
      page,
      blocks,
    },
    revalidate: 1,
  };
};
