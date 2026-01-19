/// <reference path="../.astro/types.d.ts" />

/**
 * Astro Environment Type Declarations
 * Provides types for import.meta.env and Astro virtual modules
 */

interface ImportMetaEnv {
  readonly NOTION_TOKEN: string;
  readonly NOTION_DATA_SOURCE_ID: string;
  readonly NOTION_PHOTOS_DATA_SOURCE_ID: string;
  readonly SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
