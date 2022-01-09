import React from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
}

const baseURL = 'https://zamiang-image-proxy.herokuapp.com';

export const Image = (props: IProps) => {
  const src = `${baseURL}/${props.width}/${props.src}`;

  const srcSet = `${src} ${props.width}w, ${baseURL}/${props.width * 2}/${props.src} ${
    props.width * 2
  }w, ${baseURL}/${props.width * 3}/${props.src} ${props.width * 3}w`;

  return (
    <img width={props.width || 640} srcSet={srcSet} alt={props.alt} src={src} loading="lazy" />
  );
};
