import { fragmentOn } from 'basehub';

export const imageFragment = fragmentOn('BlockImage', {
  url: true,
  width: true,
  height: true,
  alt: true,
  blurDataURL: true,
});

export const calloutFragment = fragmentOn('CalloutComponent', {
  _id: true,
  emoji: true,
  title: true,
  variant: true,
  description: {
    plainText: true,
    json: {
      content: true,
    },
  },
});
