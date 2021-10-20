import React, { useState } from 'react';
import slugify from 'slugify';
import { Block } from '../../pages/writing/[id]';
import styles from './article-nav.module.css';

const ArticleNavItem = (props: {
  text: string;
  heading: string;
  setBackgroundVisible: (b: boolean) => void;
  isBackgroundVisible: boolean;
}) => (
  <a
    className={styles.articleNavItem}
    onClick={() =>
      document
        .getElementById(slugify(props.text, { lower: true }))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  >
    <div className={styles.articleNavLeft} onMouseEnter={() => props.setBackgroundVisible(true)}>
      <div
        className={[
          styles.articleNavLeftLine,
          styles[props.heading],
          props.isBackgroundVisible ? styles.articleNavLeftLineHover : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
      ></div>
    </div>
    <div
      className={[
        styles.articleNavText,
        props.isBackgroundVisible ? styles.articleTextVisible : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {props.text}
    </div>
  </a>
);

export const ArticleNav = (props: { blocks: Block[]; title: string }) => {
  const [isBackgroundVisible, setBackgroundVisible] = useState(true);

  const headerTypes = ['heading_1', 'heading_2', 'heading_3'];
  const navBlocks = props.blocks.filter((b) => headerTypes.includes(b.type));

  return (
    <div className={styles.fixed}>
      <div className={styles.articleNav}>
        <div className={styles.content} onMouseLeave={() => setBackgroundVisible(false)}>
          <ArticleNavItem
            text={props.title}
            setBackgroundVisible={setBackgroundVisible}
            isBackgroundVisible={isBackgroundVisible}
            heading={'heading_1'}
          />
          {navBlocks.map((b) => {
            const text = (b as any)[b.type].text[0].plain_text;
            return (
              <ArticleNavItem
                key={b.id}
                text={text}
                heading={b.type}
                setBackgroundVisible={setBackgroundVisible}
                isBackgroundVisible={isBackgroundVisible}
              />
            );
          })}
        </div>
      </div>
      <div
        className={[
          styles.fixedBackground,
          isBackgroundVisible ? styles.fixedBackgroundVisible : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
      ></div>
    </div>
  );
};
