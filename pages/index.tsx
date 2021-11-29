import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Text } from '../components/article/text';
import Footer from '../components/homepage/footer';
import Header from '../components/homepage/header';
import { Image, signImageUrl } from '../components/image/imgix';
import { getItemsFromDatabase } from '../lib/notion';
import styles from './index.module.css';

export const postsDatabaseId = process.env.NOTION_POSTS_DATABASE_ID!;
export const photosDatabaseId = process.env.NOTION_PHOTOS_DATABASE_ID!;

export const baseUrl = 'https://www.zamiang.com';
const title = 'Home - Brennan Moore';
const description = 'Hi, I’m Brennan. I build innovative digital products people love.';

interface IProps {
  photos: QueryDatabaseResponse['results'];
  posts: QueryDatabaseResponse['results'];
}

export const config = {
  unstable_runtimeJS: false,
};

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
        const url = (post.properties.Cover as any)?.files[0]?.file.url;
        const slug = (post.properties.Slug as any).rich_text[0]?.plain_text;
        const width = 297;
        const { src, srcSet } = signImageUrl(url, width, width);
        return (
          <div key={post.id} className={styles.gridItem}>
            {src && (
              <Link href={`/photos/${slug}`}>
                <a className={styles.photoLinkImage}>
                  <Image src={src} srcSet={srcSet} width={width} height={width} alt={title} />
                </a>
              </Link>
            )}
            <h3 className={styles.photoTitle}>
              <Link href={`/photos/${slug}`}>
                <a className={styles.photoLink}>
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
  const orderedPosts = props.posts
    .filter((a) => (a.properties.Date as any).date?.start)
    .sort((a, b) =>
      new Date((a.properties.Date as any).date?.start as string) >
      new Date((b.properties.Date as any).date?.start as string)
        ? -1
        : 1,
    );

  return (
    <div className={styles.posts}>
      {orderedPosts.map((post) => {
        const date = new Date((post.properties.Date as any).date?.start as string).toLocaleString(
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
        <meta property="og:url" content={baseUrl} key="ogurl" />
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
      </Head>
      <main className={styles.container}>
        <Header />
        <article>
          <header className={styles.header}>
            <div className={styles.profilePhoto}></div>
            <h1>Hi, I’m Brennan.</h1>
            <h2>I build innovative digital products people love.</h2>
            <div className={styles.centerDivider}></div>
          </header>
          <div className={styles.section}>
            <p className={styles.homepageText}>
              I build beauty through engineering across healthcare, art and e-commerce. I specialize
              in delivering quality products quickly with small teams. I love to engage with the
              business to find high impact levers to chip away at intractable problems. My impact is
              business growth, engaged teams, and right-sized approach through trust, reflection and
              iterative improvement. <br />
              Some examples:
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
                  I helped incubate and found Cityblock Health inside Alphabet&rsquo;s Sidewalk
                  Labs. I led Cityblock through standing up deep data partnerships with payers,
                  custom data analytics infrastructure and building Cityblock’s best-in-class care
                  management software.
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://www.motivateco.com/">Motivate</a>
                </div>
                <div className={styles.listBody}>
                  I lead the engineering team through first successful PCI compliance audit for Citi
                  Bike. I also managed all in-house and contractor software development for the ~10
                  bike shares Motivate ran around the world.
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
            <div className={styles.divider}></div>
            <PostsList posts={posts} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.heading}>Photos</h2>
            <div className={styles.divider}></div>
            <PhotosGrid photos={props.photos} />
          </div>
          <div className={styles.section}>
            <h2 className={styles.heading}>Publications</h2>
            <div className={styles.divider}></div>
            <br />
            <ul>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://chi2010.personalinformatics.org/publications/515">
                    Assisted Self Reflection: Combining Lifetracking, Sensemaking, & Personal
                    Information Management
                  </a>
                </div>
                <div className={styles.listBody}>
                  <p>
                    <i>Brennan Moore, Max Van Kleek, David R. Karger, mc schraefel</i>
                  </p>
                  <p>
                    In this paper, we present an ongoing project designed to make self-reflection an
                    integral part of daily personal information management activity, and to provide
                    facilities for fostering greater self-understanding through exploration of
                    captured personal activity logs.
                  </p>
                </div>
              </li>
              <li>
                <div className={styles.listHeading}>
                  <a href="https://dl.acm.org/doi/10.1145/1772690.1772787">
                    Atomate it! end-user context-sensitive automation using heterogeneous
                    information sources on the web
                  </a>
                </div>
                <div className={styles.listBody}>
                  <p>
                    <i>Max Van Kleek, Brennan Moore, David R Karger, Paul André, M C Schraefe</i>
                  </p>
                  <p>
                    Our system, Atomate, treats RSS/ATOM feeds from social networking and
                    life-tracking sites as sensor streams, integrating information from such feeds
                    into a simple unified RDF world model representing people, places and things and
                    their timevarying states and activities. Combined with other information sources
                    on the web, including the user&rsquo;s online calendar, web-based e-mail client,
                    news feeds and messaging services, Atomate can be made to automatically carry
                    out a variety of simple tasks for the user, ranging from context-aware filtering
                    and messaging, to sharing and social coordination actions.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </article>
        <Footer />
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const posts = await getItemsFromDatabase(postsDatabaseId);
  const photos = await getItemsFromDatabase(photosDatabaseId);

  return {
    props: {
      posts,
      photos,
    },
    revalidate: 1,
  };
};
