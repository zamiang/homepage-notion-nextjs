import React from 'react';
import slugify from 'slugify';
import styles from './text.module.css';

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

export const Text = (props: { text?: IText[]; shouldLinkId?: boolean }) => {
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
        const id = props.shouldLinkId ? slugify(text.content, { lower: true }) : undefined;
        return (
          <span
            key={index}
            id={id}
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
