import { TocItem, extractHeadings, slugify } from '@/lib/toc';
import { describe, expect, it } from 'vitest';

describe('toc.ts', () => {
  describe('slugify', () => {
    it('should convert text to lowercase', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello! World?')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('hello   world')).toBe('hello-world');
    });

    it('should handle multiple hyphens', () => {
      expect(slugify('hello---world')).toBe('hello-world');
    });

    it('should handle empty strings', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(slugify('Chapter 1 Introduction')).toBe('chapter-1-introduction');
    });

    it('should handle apostrophes', () => {
      expect(slugify("What's New")).toBe('whats-new');
    });
  });

  describe('extractHeadings', () => {
    it('should extract h2 headings', () => {
      const content = '## Introduction\n\nSome text\n\n## Conclusion';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(2);
      expect(headings[0]).toEqual({ id: 'introduction', text: 'Introduction', level: 2 });
      expect(headings[1]).toEqual({ id: 'conclusion', text: 'Conclusion', level: 2 });
    });

    it('should extract h3 headings', () => {
      const content = '### Subsection\n\nSome text';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(1);
      expect(headings[0]).toEqual({ id: 'subsection', text: 'Subsection', level: 3 });
    });

    it('should extract h4 headings', () => {
      const content = '#### Deep Section\n\nSome text';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(1);
      expect(headings[0]).toEqual({ id: 'deep-section', text: 'Deep Section', level: 4 });
    });

    it('should extract h1 headings', () => {
      const content = '# Title\n\n## Section';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(2);
      expect(headings[0]).toEqual({ id: 'title', text: 'Title', level: 1 });
      expect(headings[1]).toEqual({ id: 'section', text: 'Section', level: 2 });
    });

    it('should not extract h5 or deeper headings', () => {
      const content = '##### Very Deep\n\n###### Even Deeper';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(0);
    });

    it('should handle mixed heading levels', () => {
      const content = `## Introduction

Some intro text.

### Background

Background info.

### Methodology

Methods used.

## Results

The results.

### Data Analysis

Analysis details.

## Conclusion`;

      const headings = extractHeadings(content);

      expect(headings).toHaveLength(6);
      expect(headings.map((h) => h.level)).toEqual([2, 3, 3, 2, 3, 2]);
    });

    it('should return empty array for content without headings', () => {
      const content = 'Just some regular text without any headings.';
      const headings = extractHeadings(content);

      expect(headings).toEqual([]);
    });

    it('should handle headings with special characters', () => {
      const content = "## What's New in 2024?\n\n### The Big Picture!";
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(2);
      expect(headings[0].id).toBe('whats-new-in-2024');
      expect(headings[1].id).toBe('the-big-picture');
    });

    it('should handle empty content', () => {
      const headings = extractHeadings('');
      expect(headings).toEqual([]);
    });

    it('should trim heading text', () => {
      const content = '##   Padded Heading   \n\nContent';
      const headings = extractHeadings(content);

      expect(headings[0].text).toBe('Padded Heading');
    });

    it('should remove bold markers from headings', () => {
      const content = '## **Bold Heading**\n\n# **Another Bold**';
      const headings = extractHeadings(content);

      expect(headings).toHaveLength(2);
      expect(headings[0].text).toBe('Bold Heading');
      expect(headings[1].text).toBe('Another Bold');
    });
  });
});
