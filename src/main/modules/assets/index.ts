import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface ManifestEntry {
  file: string;
  css?: string[];
}

type Manifest = Record<string, ManifestEntry>;

export interface Assets {
  scripts: string[];
  stylesheets: string[];
}

const entryPoint = 'src/main/assets/js/index.ts';

export function getAssets(isProduction: boolean): Assets {
  if (!isProduction) {
    return {
      scripts: ['/@vite/client', `/${entryPoint}`],
      stylesheets: [],
    };
  }

  const manifestPath = join(import.meta.dirname, '..', '..', 'public', '.vite', 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Manifest;
  const entry = manifest[entryPoint];

  if (!entry) {
    throw new Error(`Vite manifest does not contain entry point: ${entryPoint}`);
  }

  return {
    scripts: [`/${entry.file}`],
    stylesheets: (entry.css ?? []).map(css => `/${css}`),
  };
}
