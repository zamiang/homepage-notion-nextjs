import React, { Fragment } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { Text } from '../../components/article/text';
import { Block } from '../../pages/writing/[id]';
import styles from './block.module.css';

export const renderBlock = (block: Block) => {
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
          <Text text={value.text} shouldLinkId={true} />
        </h1>
      );
    case 'heading_2':
      return (
        <h2>
          <Text text={value.text} shouldLinkId={true} />
        </h2>
      );
    case 'heading_3':
      return (
        <h3>
          <Text text={value.text} shouldLinkId={true} />
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
