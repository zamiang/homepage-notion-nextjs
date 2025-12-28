export interface TocItem {
  id: string;
  text: string;
  level: number; // 2, 3, 4, etc.
}

/**
 * Generate a URL-safe slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Extract headings from markdown content for table of contents
 * Generates IDs for anchor linking
 * Extracts h1-h4 (# through ####) from markdown
 */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length; // Number of # characters
    // Remove ** bold markers from heading text
    const text = match[2].trim().replace(/^\*\*|\*\*$/g, '');
    const id = slugify(text);

    headings.push({ id, text, level });
  }

  return headings;
}
