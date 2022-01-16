import NextImage from 'next/image';
import React from 'react';

interface IProps {
  alt: string;
  src: string;
  width: number;
  height?: number;
  pageId: string;
}

const baseURL = 'https://image.zamiang.com';

export const Image = (props: IProps) => {
  const width = props.width || 640;

  const filename = new URL(props.src).pathname.split('/').pop();
  const imageUrl = `/images/${props.pageId}/${filename}`;
  const src = `${baseURL}${imageUrl}`;

  return (
    <NextImage
      width={width}
      height={props.height}
      alt={props.alt}
      src={src}
      loading="lazy"
      layout={props.height ? 'intrinsic' : 'fill'}
    />
  );
};
