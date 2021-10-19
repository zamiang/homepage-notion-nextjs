import Head from 'next/head';
import React, { Fragment } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { getBlocks, getDatabase, getPageBySlug } from '../../lib/notion';
import { PostsList, postsDatabaseId } from '../index';
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

const renderBlock = (block: Block) => {
  const { type, id } = block;
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
    case 'bulleted_list_item':
      return (
        <ol>
          <li>
            <Text text={value.text} />
          </li>
        </ol>
      );

    case 'embed':
      const tweetId = value.url.split('/status/')[1]?.split('?')[0];
      if (!tweetId) {
        return `❌ Unsupported block (currently only supports twitter embeds)`;
      }
      return <TwitterTweetEmbed tweetId={tweetId} />;

    case 'numbered_list_item':
      return (
        <ul>
          <li>
            <Text text={value.text} />
          </li>
        </ul>
      );
    case 'divider':
      return <div className={styles.divider}>· · ·</div>;
    case 'quote':
      return (
        <blockquote>
          <Text text={value.text} />
        </blockquote>
      );

    case 'code':
      return (
        <pre>
          <Text text={value.text} />
        </pre>
      );

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

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type Params = UnPromisify<ReturnType<typeof getStaticProps>>['props'];
type Block = Params['blocks'][0];

export default function Post({ page, blocks, posts }: Params) {
  if (!page || !blocks) {
    return <div />;
  }
  const excerpt = (page.properties.Excerpt as any).rich_text[0]?.plain_text;
  const title = (page.properties.Title as any).title[0].plain_text;
  const date = new Date((page.properties.Date as any).date.start as string).toLocaleString(
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
        <meta name="description" content={excerpt} />
        <meta property="og:description" content={excerpt} key="ogdesc" />
      </Head>
      <Header />
      <article className={styles.container}>
        <div className={styles.top}>
          <h1 className={styles.name}>
            <Text text={(page.properties.Title as any).title} />
          </h1>
          <div className={styles.excerpt}>{excerpt}</div>
          <div className={styles.date}>{date}</div>
          <div className={styles.shortLine}></div>
        </div>
        <section>
          {blocks.map((block) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
        <div className={styles.shortLine}></div>
        <h2 className={styles.name}>Other Writing</h2>
        <PostsList posts={posts} />
      </article>
      <Footer />
    </div>
  );
}

export const getStaticPaths = async () => {
  const database = await getDatabase(postsDatabaseId);
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
  const posts = await getDatabase(postsDatabaseId);
  const page = await getPageBySlug(id, postsDatabaseId);
  const blocks = await getBlocks(page.id);

  const filteredPosts = posts
    .filter(
      (p) =>
        (p.properties.Status as any).select?.name === 'Live' &&
        (p.properties['Featured on homepage'] as any).select?.name === 'Featured' &&
        p.id !== page.id,
    )
    .sort((a, b) =>
      new Date((a.properties.Date as any).date?.start as string) >
      new Date((b.properties.Date as any).date?.start as string)
        ? -1
        : 1,
    )
    .slice(0, 3);

  return {
    props: {
      posts: filteredPosts,
      page,
      blocks,
    },
    revalidate: 1,
  };
};
