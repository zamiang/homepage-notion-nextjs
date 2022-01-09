import React from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
}

const baseURL = 'https://image.zamiang.com';

export const Image = (props: IProps) => {
  const width = props.width || 640;
  const src = `${baseURL}/${width}x,q60/${props.src}`;

  const srcSet = `${src} ${props.width}w, ${baseURL}/${width * 2}x,q60/${props.src} ${
    props.width * 2
  }w, ${baseURL}/${width * 3}x,q60/${props.src} ${width * 3}w`;

  return <img width={width} srcSet={srcSet} alt={props.alt} src={src} loading="lazy" />;
};
