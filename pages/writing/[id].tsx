import Head from 'next/head';
import React from 'react';
import { ArticleNav } from '../../components/article/article-nav';
import { renderBlock } from '../../components/article/render-article-block';
import { Text } from '../../components/article/text';
import Footer from '../../components/homepage/footer';
import Header from '../../components/homepage/header';
import { getBlocks, getItemsFromDatabase, getPageBySlug } from '../../lib/notion';
import Custom404 from '../404';
import { PostsList, postsDatabaseId } from '../index';
import styles from './writing.module.css';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type Params = UnPromisify<ReturnType<typeof getStaticProps>>['props'];
export type Block = Params['blocks'][0];

export default function Post({ page, blocks, posts }: Params) {
  if (!page || !blocks) {
    return <Custom404 />;
  }
  const excerpt = (page.properties.Excerpt as any).rich_text[0]?.plain_text;
  const title = (page.properties.Title as any).title[0].plain_text;
  const ogImageUrl = (page.properties.Cover as any)?.files[0]?.file.url;
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
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} key="ogdesc" />}
      </Head>
      <Header />
      <ArticleNav blocks={blocks} title={title} />
      <article className={styles.container}>
        <div className={styles.top}>
          <h1 className={styles.title}>
            <Text text={(page.properties.Title as any).title} />
          </h1>
          <div className={styles.excerpt}>{excerpt}</div>
          <div className={styles.date}>{date}</div>
          <div className={styles.shortLine}></div>
        </div>
        <section>
          {blocks.map((block) => (
            <React.Fragment key={block.id}>{renderBlock(block)}</React.Fragment>
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
  const database = await getItemsFromDatabase(postsDatabaseId);
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
  const posts = await getItemsFromDatabase(postsDatabaseId);
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
