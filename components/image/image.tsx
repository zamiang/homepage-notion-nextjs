import React from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
  height?: number;
}

const baseURL = 'https://d33a5xufxp4p1r.cloudfront.net';

export const Image = (props: IProps) => {
  const width = props.width || 640;
  const src = `${baseURL}/${width}x,q60/${props.src}`;

  const srcSet = `${src} 1x, ${baseURL}/${width * 2}x,q60/${props.src} 2x, ${baseURL}/${
    width * 3
  }x,q60/${props.src} 3x`;

  return (
    <img
      width={width}
      height={props.height}
      srcSet={srcSet}
      alt={props.alt}
      src={src}
      loading="lazy"
    />
  );
};
