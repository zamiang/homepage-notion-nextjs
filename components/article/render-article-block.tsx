import Image from 'next/image';
import React, { Fragment } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Text } from '../../components/article/text';
import { Block } from '../../pages/writing/[id]';
import styles from './block.module.css';

export const renderBlock = (block: Block, width = 640) => {
  const { type, id } = block;
  const value = (block as any)[type];
  const formattedId = id.split('-').join('');
  switch (type) {
    case 'paragraph':
      return (
        <p id={formattedId}>
          <Text text={value.text} />
        </p>
      );
    case 'heading_1':
      return (
        <h1 className={styles[`${type}`]} id={formattedId}>
          <div className={styles[`${type}-line`]}></div>
          <Text text={value.text} shouldLinkId={true} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2 className={styles[`${type}`]} id={formattedId}>
          <div className={styles[`${type}-line`]}></div>
          <Text text={value.text} shouldLinkId={true} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3 className={styles[`${type}`]} id={formattedId}>
          <div className={styles[`${type}-line`]}></div>
          <Text text={value.text} shouldLinkId={true} />
        </h3>
      );
    case 'bulleted_list_item':
      return (
        <ol id={formattedId}>
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
        <ul id={formattedId}>
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
        <pre id={formattedId}>
          <Text text={value.text} />
        </pre>
      );

    case 'bookmark':
      return (
        <div id={formattedId}>
          <a href={value.url}>{value.url}</a>
        </div>
      );

    case 'to_do':
      return (
        <div id={formattedId}>
          <label htmlFor={id}>
            <input type="checkbox" id={formattedId} defaultChecked={value.checked} />{' '}
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
            <Fragment key={block.id}>{renderBlock(block, width)}</Fragment>
          ))}
        </details>
      );

    case 'child_page':
      return <p>{value.title}</p>;

    case 'image':
      const url = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption && value.caption[0] ? value.caption[0].plain_text : '';
      return (
        <figure>
          <Image src={url} alt={caption} width={width} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );

    default:
      return `❌ Unsupported block (${
        type === 'unsupported' ? 'unsupported by Notion API' : type
      })`;
  }
};
