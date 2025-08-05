import { render } from '@testing-library/react';
import React from 'react';

import PhotoPage from '../src/app/photos/[slug]/page';
import WritingPage from '../src/app/writing/[slug]/page';

describe('Photo Page', () => {
  test('renders without crashing', async () => {
    const params = { slug: 'example-slug' } as any;
    render(<PhotoPage params={params} />);
  });
});

describe('Writing Page', () => {
  test('renders without crashing', async () => {
    const params = { slug: 'example-slug' } as any;
    render(<WritingPage params={params} />);
  });
});
