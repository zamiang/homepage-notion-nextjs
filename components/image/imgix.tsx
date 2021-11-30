import ImgixClient from 'imgix-core-js';
import React from 'react';

const client = new ImgixClient({
  domain: 'zamiang.imgix.net',
  secureURLToken: process.env.NEXT_PUBLIC_IMGIX_TOKEN,
});

export const signImageUrl = (imagePath: string, width = 640, height?: number) => {
  const params = {
    auto: 'format,compress',
    w: width,
  };
  if (height) {
    (params as any).h = height;
    (params as any).ar = '1:1'; // todo
    (params as any).fit = 'crop'; // todo
  }
  const src = client.buildURL(imagePath, params);
  const srcSet = client.buildSrcSet(imagePath, params, {
    widths: [width, Math.round(width * 1.5), width * 2],
  });

  return { src, srcSet };
};

interface iProps {
  alt: string;
  srcSet: string;
  src: string;
  width?: number;
  height?: number;
}
export const Image = ({ width, height, src, srcSet, alt }: iProps) => (
  <img width={width || 640} height={height} srcSet={srcSet} alt={alt} src={src} />
);
