import { downloadImage, getFilename } from '@/lib/download-image';
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
  },
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  createWriteStream: vi.fn(),
}));
vi.mock('axios', () => ({
  default: vi.fn(),
}));

// Mock console methods
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('download-image.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    it('should handle invalid URLs gracefully', () => {
      const result = getFilename('not-a-valid-url');
      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle empty strings', () => {
      const result = getFilename('');
      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle URLs ending with slash', () => {
      expect(getFilename('https://example.com/images/')).toBe('');
    });
  });

  describe('downloadImage', () => {
    const mockUrl = 'https://example.com/test-image.jpg';
    const mockFileName = 'test-image.jpg';
    const mockDest = path.join(process.cwd(), 'public', 'images', mockFileName);
    const mockDirname = path.dirname(mockDest);

    beforeEach(() => {
      (fs.existsSync as any).mockReturnValue(false);
      (fs.mkdirSync as any).mockImplementation(() => undefined as any);
      (fs.createWriteStream as any).mockReturnValue({
        on: vi.fn((event, callback) => {
          if (event === 'close') {
            // Simulate successful write
            setTimeout(callback, 0);
          }
          return this;
        }),
      } as any);
    });

    it('should download image successfully', async () => {
      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      await downloadImage(mockUrl);

      // Check directory creation
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockDirname, { recursive: true });

      // Check file download
      expect(axios).toHaveBeenCalledWith({
        url: mockUrl,
        method: 'GET',
        responseType: 'stream',
      });

      // Check write stream creation
      expect(fs.createWriteStream).toHaveBeenCalledWith(mockDest);
    });

    it('should skip download if file already exists', async () => {
      (fs.existsSync as any).mockImplementation((path: string) => {
        if (path === mockDest) return true; // File exists
        return false; // Directory doesn't exist
      });

      await downloadImage(mockUrl);

      expect(axios).not.toHaveBeenCalled();
      expect(fs.createWriteStream).not.toHaveBeenCalled();
    });

    it('should not create directory if it already exists', async () => {
      (fs.existsSync as any).mockImplementation((path: string) => {
        if (path === mockDirname) return true; // Directory exists
        return false;
      });

      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      await downloadImage(mockUrl);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
      expect(axios).toHaveBeenCalled();
    });

    it('should handle download errors gracefully', async () => {
      (axios as any).mockRejectedValue(new Error('Network error'));

      await downloadImage(mockUrl);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        mockUrl,
        'ERROR STORING THIS IMAGE',
        expect.any(Error),
      );
    });

    it('should handle write stream errors', async () => {
      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      let errorHandler: any = null;

      const mockWriteStream = {
        on: vi.fn((event, callback) => {
          if (event === 'error') {
            errorHandler = callback;
          }
          // Don't trigger close event when there's an error
          return mockWriteStream;
        }),
      };

      (fs.createWriteStream as any).mockReturnValue(mockWriteStream as any);

      // Start the download (don't await it since it won't complete due to error)
      downloadImage(mockUrl);

      // Trigger the error after a small delay
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (errorHandler) {
        errorHandler(new Error('Write error'));
      }

      // Give it time to handle the error
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle URLs without filename', async () => {
      const urlWithoutFile = 'https://example.com/';
      const expectedDest = path.join(process.cwd(), 'public', 'images', '');

      await downloadImage(urlWithoutFile);

      // Should still attempt to create the file, even with empty filename
      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedDest);
    });

    it('should handle axios returning undefined', async () => {
      (axios as any).mockResolvedValue(undefined as any);

      await downloadImage(mockUrl);

      // Should handle gracefully without throwing
      expect(fs.createWriteStream).toHaveBeenCalled();
    });

    it('should handle directory creation errors', async () => {
      (fs.mkdirSync as any).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await downloadImage(mockUrl);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        mockUrl,
        'ERROR STORING THIS IMAGE',
        expect.any(Error),
      );
    });

    it('should handle concurrent downloads of the same file', async () => {
      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      // Start two downloads simultaneously
      const download1 = downloadImage(mockUrl);
      const download2 = downloadImage(mockUrl);

      await Promise.all([download1, download2]);

      // Both should attempt to download (no file locking mechanism)
      expect(axios).toHaveBeenCalledTimes(2);
      expect(fs.createWriteStream).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in filenames', async () => {
      const specialUrl = 'https://example.com/image%20with%20spaces.jpg';
      const expectedFilename = 'image%20with%20spaces.jpg';
      const expectedDest = path.join(process.cwd(), 'public', 'images', expectedFilename);

      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      await downloadImage(specialUrl);

      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedDest);
    });

    it('should handle very long filenames', async () => {
      const longFilename = 'a'.repeat(300) + '.jpg';
      const longUrl = `https://example.com/${longFilename}`;
      const expectedDest = path.join(process.cwd(), 'public', 'images', longFilename);

      const mockStream = {
        pipe: vi.fn(),
      };

      (axios as any).mockResolvedValue({
        data: mockStream,
      } as any);

      await downloadImage(longUrl);

      expect(fs.createWriteStream).toHaveBeenCalledWith(expectedDest);
    });
  });
});
