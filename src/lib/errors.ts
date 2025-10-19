/**
 * Error handling utilities for consistent error logging and reporting
 */

/**
 * Standard error context for logging
 */
export interface ErrorContext {
  error: unknown;
  context: string;
  metadata?: Record<string, unknown>;
}

/**
 * Converts an unknown error to a standardized error context for logging
 */
export function errorToLogContext(
  error: unknown,
  context: string,
  metadata?: Record<string, unknown>,
): ErrorContext {
  return {
    error:
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error,
    context,
    metadata,
  };
}

/**
 * Logs an error with context to the console
 * In production, this could be extended to send to an error tracking service
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, unknown>,
): void {
  const errorContext = errorToLogContext(error, context, metadata);
  console.error(`Error in ${context}:`, errorContext);
}

/**
 * Gets a user-friendly error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Custom error class for Notion API errors
 */
export class NotionApiError extends Error {
  constructor(
    message: string,
    public readonly pageId?: string,
    public readonly operation?: string,
  ) {
    super(message);
    this.name = 'NotionApiError';
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
