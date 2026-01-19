import axios from 'axios';
import fs from 'fs';
import path from 'path';

/** Allowed protocols for image downloads */
const ALLOWED_PROTOCOLS = ['https:'];

/** Private IP ranges to block (SSRF protection) */
const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^169\.254\./, // Link-local
  /^0\./, // Current network
  /^::1$/, // IPv6 loopback
  /^fc00:/, // IPv6 private
  /^fe80:/, // IPv6 link-local
];

/** Blocked hostnames (SSRF protection) */
const BLOCKED_HOSTNAMES = ['localhost', 'localhost.localdomain', '0.0.0.0'];

/**
 * Validates a URL for safe downloading (SSRF protection)
 * Blocks private IPs, localhost, and non-HTTPS protocols
 */
export function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow HTTPS
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return false;
    }

    // Block localhost and similar
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTNAMES.includes(hostname)) {
      return false;
    }

    // Block private IP ranges
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts and sanitizes filename from URL
 * Returns undefined if URL is invalid or filename is unsafe
 */
export function getFilename(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const filename = parsed.pathname.split('/').pop();

    if (!filename) {
      return undefined;
    }

    // Sanitize: remove path traversal attempts and unsafe characters
    const sanitized = filename
      .replace(/\.\./g, '') // Remove ..
      .replace(/[/\\]/g, '') // Remove path separators
      .replace(/^\.+/, ''); // Remove leading dots

    // Reject if sanitization resulted in empty string or still contains suspicious patterns
    if (!sanitized || sanitized.includes('..') || sanitized.includes('\0')) {
      return undefined;
    }

    return sanitized;
  } catch {
    return undefined;
  }
}

/**
 * Validates that a destination path is within the allowed directory
 * Prevents path traversal attacks
 */
function isPathWithinDirectory(destPath: string, allowedDir: string): boolean {
  const resolvedDest = path.resolve(destPath);
  const resolvedDir = path.resolve(allowedDir);
  return resolvedDest.startsWith(resolvedDir + path.sep);
}

const directoryExists = (dirPath: string): boolean => {
  try {
    return fs.existsSync(dirPath);
  } catch {
    return false;
  }
};

const fileExists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

/**
 * Downloads a file from URL
 * Throws on error instead of returning undefined
 */
async function getFile(url: string): Promise<{ data: NodeJS.ReadableStream }> {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 30000, // 30 second timeout
  });
  return response;
}

/**
 * Downloads an image from URL to public/images directory
 * Includes path traversal and SSRF protections
 */
export async function downloadImage(url: string): Promise<void> {
  // SSRF protection: validate URL
  if (!isUrlSafe(url)) {
    throw new Error(`Unsafe URL blocked: ${url}`);
  }

  const fileName = getFilename(url);
  if (!fileName) {
    throw new Error(`Invalid filename from URL: ${url}`);
  }

  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const dest = path.join(imagesDir, fileName);

  // Path traversal protection: ensure destination is within allowed directory
  if (!isPathWithinDirectory(dest, imagesDir)) {
    throw new Error(`Path traversal attempt blocked: ${fileName}`);
  }

  try {
    const dirname = path.dirname(dest);
    if (!directoryExists(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    if (fileExists(dest)) {
      return;
    }

    const file = await getFile(url);
    const download = fs.createWriteStream(dest);

    return await new Promise((resolve, reject) => {
      file.data.pipe(download);
      download.on('close', resolve);
      download.on('error', (err) => {
        // Clean up partial file on error
        try {
          fs.unlinkSync(dest);
        } catch {
          // Ignore cleanup errors
        }
        reject(err);
      });
    });
  } catch (err) {
    console.error(`Error downloading image from ${url}:`, err);
    throw err;
  }
}
