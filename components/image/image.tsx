import React from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
  pageId: string;
}

const baseURL = 'https://image.zamiang.com';

export const Image = (props: IProps) => {
  const width = props.width || 640;
  if (process.env.NODE_ENV === 'development') {
    return <img width={width} alt={props.alt} src={props.src} loading="lazy" />;
  }

  const filename = new URL(props.src).pathname.split('/').pop();
  const imageUrl = `https://www.zamiang.com/images/${props.pageId}/${filename}`;
  const src = `${baseURL}/${width}x/${imageUrl}`;
  const srcSet = `${src} ${props.width}w, ${baseURL}/${width * 2}x/${imageUrl} ${
    props.width * 2
  }w, ${baseURL}/${width * 3}x/${imageUrl} ${width * 3}w`;

  return <img width={width} srcSet={srcSet} alt={props.alt} src={src} loading="lazy" />;
};
