import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock all external dependencies
vi.mock('@/lib/notion', async () => {
  const actual = await vi.importActual('@/lib/notion');
  return {
    ...actual,
    getPostsFromCache: vi.fn(),
    getPhotosFromCache: vi.fn(),
    getAllSectionPostsFromCache: vi.fn(),
    getWordCount: vi.fn(),
  };
});

// Mock Next.js modules
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map()),
}));

// Mock image components
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, width, height } = props;
    return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" />`;
  },
}));

// Mock fetch for API calls
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: vi.fn(),
    text: vi.fn(),
  } as unknown as Response),
) as any;
