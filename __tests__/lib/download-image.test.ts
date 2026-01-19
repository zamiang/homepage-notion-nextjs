import { downloadImage, getFilename, isUrlSafe } from '@/lib/download-image';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    createWriteStream: vi.fn(),
    unlinkSync: vi.fn(),
  },
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  createWriteStream: vi.fn(),
  unlinkSync: vi.fn(),
}));
vi.mock('axios', () => ({
  default: vi.fn(),
}));

// Mock console methods
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('download-image.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isUrlSafe', () => {
    it('should allow valid HTTPS URLs', () => {
      expect(isUrlSafe('https://example.com/image.jpg')).toBe(true);
      expect(isUrlSafe('https://cdn.notion.so/image.png')).toBe(true);
      expect(isUrlSafe('https://s3.amazonaws.com/bucket/file.gif')).toBe(true);
    });

    it('should block HTTP URLs', () => {
      expect(isUrlSafe('http://example.com/image.jpg')).toBe(false);
    });

    it('should block localhost', () => {
      expect(isUrlSafe('https://localhost/image.jpg')).toBe(false);
      expect(isUrlSafe('https://localhost.localdomain/image.jpg')).toBe(false);
      expect(isUrlSafe('https://0.0.0.0/image.jpg')).toBe(false);
    });

    it('should block private IP ranges (127.x.x.x)', () => {
      expect(isUrlSafe('https://127.0.0.1/image.jpg')).toBe(false);
      expect(isUrlSafe('https://127.1.2.3/image.jpg')).toBe(false);
    });

    it('should block private IP ranges (10.x.x.x)', () => {
      expect(isUrlSafe('https://10.0.0.1/image.jpg')).toBe(false);
      expect(isUrlSafe('https://10.255.255.255/image.jpg')).toBe(false);
    });

    it('should block private IP ranges (192.168.x.x)', () => {
      expect(isUrlSafe('https://192.168.0.1/image.jpg')).toBe(false);
      expect(isUrlSafe('https://192.168.255.255/image.jpg')).toBe(false);
    });

    it('should block private IP ranges (172.16-31.x.x)', () => {
      expect(isUrlSafe('https://172.16.0.1/image.jpg')).toBe(false);
      expect(isUrlSafe('https://172.31.255.255/image.jpg')).toBe(false);
      // 172.32 is not private
      expect(isUrlSafe('https://172.32.0.1/image.jpg')).toBe(true);
    });

    it('should block link-local addresses', () => {
      expect(isUrlSafe('https://169.254.1.1/image.jpg')).toBe(false);
    });

    it('should block file:// protocol', () => {
      expect(isUrlSafe('file:///etc/passwd')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(isUrlSafe('not-a-url')).toBe(false);
      expect(isUrlSafe('')).toBe(false);
    });
  });

  describe('getFilename', () => {
    it('should extract filename from URL', () => {
      expect(getFilename('https://example.com/images/test.jpg')).toBe('test.jpg');
      expect(getFilename('https://example.com/path/to/image.png')).toBe('image.png');
      expect(getFilename('https://example.com/file.gif')).toBe('file.gif');
    });

    it('should handle URLs with query parameters', () => {
      expect(getFilename('https://example.com/image.jpg?size=large')).toBe('image.jpg');
      expect(getFilename('https://example.com/test.png?v=123&format=webp')).toBe('test.png');
    });

    it('should handle URLs without file extension', () => {
      expect(getFilename('https://example.com/images/filename')).toBe('filename');
    });

    it('should return undefined for invalid URLs', () => {
      expect(getFilename('not-a-valid-url')).toBeUndefined();
      expect(getFilename('')).toBeUndefined();
    });

    it('should return undefined for URLs ending with slash (empty filename)', () => {
      expect(getFilename('https://example.com/images/')).toBeUndefined();
    });

    it('should sanitize path traversal attempts', () => {
      // These should be sanitized, not return the dangerous filename
      expect(getFilename('https://example.com/../../../etc/passwd')).toBe('passwd');
      expect(getFilename('https://example.com/..%2F..%2Fetc/passwd')).toBe('passwd');
    });

    it('should reject filenames with only dots', () => {
      expect(getFilename('https://example.com/..')).toBeUndefined();
      expect(getFilename('https://example.com/...')).toBeUndefined();
    });

    it('should handle special characters in filenames', () => {
      expect(getFilename('https://example.com/image%20with%20spaces.jpg')).toBe(
        'image%20with%20spaces.jpg',
      );
    });
  });

  describe('downloadImage', () => {
    const mockUrl = 'https://example.com/test-image.jpg';
    const mockFileName = 'test-image.jpg';
    const mockDest = path.join(process.cwd(), 'public', 'images', mockFileName);
    const mockDirname = path.dirname(mockDest);

    beforeEach(() => {
      (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (fs.mkdirSync as ReturnType<typeof vi.fn>).mockImplementation(() => undefined);
      (fs.createWriteStream as ReturnType<typeof vi.fn>).mockReturnValue({
        on: vi.fn((event, callback) => {
          if (event === 'close') {
            setTimeout(callback, 0);
          }
          return this;
        }),
      });
    });

    it('should download image successfully', async () => {
      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });

      await downloadImage(mockUrl);

      expect(fs.mkdirSync).toHaveBeenCalledWith(mockDirname, { recursive: true });
      expect(axios).toHaveBeenCalledWith({
        url: mockUrl,
        method: 'GET',
        responseType: 'stream',
        timeout: 30000,
      });
      expect(fs.createWriteStream).toHaveBeenCalledWith(mockDest);
    });

    it('should skip download if file already exists', async () => {
      (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((p: string) => {
        if (p === mockDest) return true;
        return false;
      });

      await downloadImage(mockUrl);

      expect(axios).not.toHaveBeenCalled();
      expect(fs.createWriteStream).not.toHaveBeenCalled();
    });

    it('should not create directory if it already exists', async () => {
      (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((p: string) => {
        if (p === mockDirname) return true;
        return false;
      });

      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });

      await downloadImage(mockUrl);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(axios).toHaveBeenCalled();
    });

    it('should throw on download errors', async () => {
      (axios as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

      await expect(downloadImage(mockUrl)).rejects.toThrow('Network error');
    });

    it('should throw for URLs without valid filename', async () => {
      const urlWithoutFile = 'https://example.com/';

      await expect(downloadImage(urlWithoutFile)).rejects.toThrow('Invalid filename from URL');
    });

    it('should throw on directory creation errors', async () => {
      (fs.mkdirSync as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await expect(downloadImage(mockUrl)).rejects.toThrow('Permission denied');
    });

    it('should handle concurrent downloads of the same file', async () => {
      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });

      const download1 = downloadImage(mockUrl);
      const download2 = downloadImage(mockUrl);

      await Promise.all([download1, download2]);

      expect(axios).toHaveBeenCalledTimes(2);
      expect(fs.createWriteStream).toHaveBeenCalledTimes(2);
    });
  });

  describe('SSRF protection', () => {
    it('should block localhost URLs', async () => {
      await expect(downloadImage('https://localhost/image.jpg')).rejects.toThrow(
        'Unsafe URL blocked',
      );
    });

    it('should block private IP URLs', async () => {
      await expect(downloadImage('https://192.168.1.1/image.jpg')).rejects.toThrow(
        'Unsafe URL blocked',
      );
      await expect(downloadImage('https://10.0.0.1/image.jpg')).rejects.toThrow(
        'Unsafe URL blocked',
      );
      await expect(downloadImage('https://127.0.0.1/image.jpg')).rejects.toThrow(
        'Unsafe URL blocked',
      );
    });

    it('should block HTTP URLs', async () => {
      await expect(downloadImage('http://example.com/image.jpg')).rejects.toThrow(
        'Unsafe URL blocked',
      );
    });
  });

  describe('path traversal protection', () => {
    beforeEach(() => {
      (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (fs.mkdirSync as ReturnType<typeof vi.fn>).mockImplementation(() => undefined);
    });

    it('should sanitize path traversal in filename', async () => {
      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });
      (fs.createWriteStream as ReturnType<typeof vi.fn>).mockReturnValue({
        on: vi.fn((event, callback) => {
          if (event === 'close') setTimeout(callback, 0);
          return this;
        }),
      });

      // The filename should be sanitized to just 'passwd'
      await downloadImage('https://example.com/path/../../../etc/passwd');

      // Should write to sanitized path, not the traversal path
      expect(fs.createWriteStream).toHaveBeenCalledWith(
        expect.stringContaining(path.join('public', 'images', 'passwd')),
      );
    });
  });

  describe('edge cases', () => {
    beforeEach(() => {
      (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);
      (fs.mkdirSync as ReturnType<typeof vi.fn>).mockImplementation(() => undefined);
    });

    it('should handle special characters in filenames', async () => {
      const specialUrl = 'https://example.com/image%20with%20spaces.jpg';
      const expectedFilename = 'image%20with%20spaces.jpg';
      const expectedDest = path.join(process.cwd(), 'public', 'images', expectedFilename);

      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });
      (fs.createWriteStream as ReturnType<typeof vi.fn>).mockReturnValue({
        on: vi.fn((event, callback) => {
          if (event === 'close') setTimeout(callback, 0);
          return this;
        }),
      });

      await downloadImage(specialUrl);

      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedDest);
    });

    it('should handle very long filenames', async () => {
      const longFilename = 'a'.repeat(300) + '.jpg';
      const longUrl = `https://example.com/${longFilename}`;
      const expectedDest = path.join(process.cwd(), 'public', 'images', longFilename);

      const mockStream = { pipe: vi.fn() };
      (axios as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStream });
      (fs.createWriteStream as ReturnType<typeof vi.fn>).mockReturnValue({
        on: vi.fn((event, callback) => {
          if (event === 'close') setTimeout(callback, 0);
          return this;
        }),
      });

      await downloadImage(longUrl);

      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedDest);
    });
  });
});
