import { readFileSync } from 'node:fs';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAssets } from '../../../../main/modules/assets/index.js';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
}));

const readManifest = vi.mocked(readFileSync);

describe('getAssets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns Vite development assets outside production', () => {
    const assets = getAssets(false);

    expect(assets).toEqual({
      scripts: ['/@vite/client', '/src/main/assets/js/index.ts'],
      stylesheets: [],
    });

    expect(readManifest).not.toHaveBeenCalled();
  });

  it('returns hashed production assets from the Vite manifest', () => {
    readManifest.mockReturnValue(
      JSON.stringify({
        'src/main/assets/js/index.ts': {
          file: 'assets/index-CHBx6mVH.js',
          css: ['assets/index-CYUbmKHc.css'],
        },
      })
    );

    const assets = getAssets(true);

    expect(assets).toEqual({
      scripts: ['/assets/index-CHBx6mVH.js'],
      stylesheets: ['/assets/index-CYUbmKHc.css'],
    });

    expect(readManifest).toHaveBeenCalledWith(expect.stringMatching(/public[/\\]\.vite[/\\]manifest\.json$/), 'utf8');
  });

  it('throws when the Vite manifest does not contain the application entry point', () => {
    readManifest.mockReturnValue(JSON.stringify({}));

    expect(() => getAssets(true)).toThrow('Vite manifest does not contain entry point: src/main/assets/js/index.ts');
  });
});
