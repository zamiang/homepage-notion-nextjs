import {
  NotionApiError,
  ValidationError,
  errorToLogContext,
  getErrorMessage,
  logError,
} from '@/lib/errors';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('errors', () => {
  describe('errorToLogContext', () => {
    it('should convert Error instance to log context', () => {
      const error = new Error('Test error');
      const result = errorToLogContext(error, 'test-context');

      expect(result.context).toBe('test-context');
      expect(result.error).toEqual({
        message: 'Test error',
        stack: error.stack,
        name: 'Error',
      });
    });

    it('should convert Error instance with metadata', () => {
      const error = new Error('Test error');
      const metadata = { userId: '123', action: 'fetch' };
      const result = errorToLogContext(error, 'test-context', metadata);

      expect(result.metadata).toEqual(metadata);
    });

    it('should handle non-Error objects', () => {
      const error = { custom: 'error object' };
      const result = errorToLogContext(error, 'test-context');

      expect(result.context).toBe('test-context');
      expect(result.error).toEqual({ custom: 'error object' });
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      const result = errorToLogContext(error, 'test-context');

      expect(result.error).toBe('String error message');
    });

    it('should handle null or undefined', () => {
      const result = errorToLogContext(null, 'test-context');
      expect(result.error).toBeNull();

      const result2 = errorToLogContext(undefined, 'test-context');
      expect(result2.error).toBeUndefined();
    });
  });

  describe('logError', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log error with context to console', () => {
      const error = new Error('Test error');
      logError('test-context', error);

      expect(console.error).toHaveBeenCalledWith(
        'Error in test-context:',
        expect.objectContaining({
          context: 'test-context',
          error: expect.objectContaining({
            message: 'Test error',
          }),
        }),
      );
    });

    it('should log error with metadata', () => {
      const error = new Error('Test error');
      const metadata = { userId: '123' };
      logError('test-context', error, metadata);

      expect(console.error).toHaveBeenCalledWith(
        'Error in test-context:',
        expect.objectContaining({
          metadata,
        }),
      );
    });

    it('should log non-Error objects', () => {
      const error = { custom: 'error' };
      logError('test-context', error);

      expect(console.error).toHaveBeenCalledWith(
        'Error in test-context:',
        expect.objectContaining({
          error: { custom: 'error' },
        }),
      );
    });
  });

  describe('getErrorMessage', () => {
    it('should extract message from Error instance', () => {
      const error = new Error('Test error message');
      expect(getErrorMessage(error)).toBe('Test error message');
    });

    it('should return string error as-is', () => {
      expect(getErrorMessage('String error')).toBe('String error');
    });

    it('should return default message for unknown error types', () => {
      expect(getErrorMessage(null)).toBe('An unknown error occurred');
      expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
      expect(getErrorMessage(123)).toBe('An unknown error occurred');
      expect(getErrorMessage({ custom: 'error' })).toBe('An unknown error occurred');
    });
  });

  describe('NotionApiError', () => {
    it('should create error with message only', () => {
      const error = new NotionApiError('API failed');
      expect(error.message).toBe('API failed');
      expect(error.name).toBe('NotionApiError');
      expect(error.pageId).toBeUndefined();
      expect(error.operation).toBeUndefined();
    });

    it('should create error with page ID', () => {
      const error = new NotionApiError('API failed', 'page-123');
      expect(error.message).toBe('API failed');
      expect(error.pageId).toBe('page-123');
    });

    it('should create error with page ID and operation', () => {
      const error = new NotionApiError('API failed', 'page-123', 'fetchBlocks');
      expect(error.message).toBe('API failed');
      expect(error.pageId).toBe('page-123');
      expect(error.operation).toBe('fetchBlocks');
    });

    it('should be instance of Error', () => {
      const error = new NotionApiError('API failed');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NotionApiError);
    });
  });

  describe('ValidationError', () => {
    it('should create error with message only', () => {
      const error = new ValidationError('Validation failed');
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error.field).toBeUndefined();
    });

    it('should create error with field', () => {
      const error = new ValidationError('Invalid email', 'email');
      expect(error.message).toBe('Invalid email');
      expect(error.field).toBe('email');
    });

    it('should be instance of Error', () => {
      const error = new ValidationError('Validation failed');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ValidationError);
    });
  });
});
