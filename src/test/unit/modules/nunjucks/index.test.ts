import type { NextFunction, RequestHandler } from 'express';
import nunjucks from 'nunjucks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Nunjucks } from '../../../../main/modules/nunjucks/index.js';

vi.mock('nunjucks', () => ({
  default: {
    configure: vi.fn(),
  },
}));

describe('Nunjucks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures Nunjucks for the application', () => {
    let middleware: RequestHandler | undefined;

    const app = {
      set: vi.fn(),
      use: vi.fn((handler: RequestHandler) => {
        middleware = handler;
      }),
    };

    new Nunjucks(true).enableFor(app as never);

    expect(app.set).toHaveBeenCalledWith('view engine', 'njk');

    const configure = vi.mocked(nunjucks.configure);

    expect(configure).toHaveBeenCalledOnce();

    const [paths, options] = configure.mock.calls[0];

    expect(paths).toHaveLength(2);
    expect(paths[0]).toMatch(/govuk-frontend.*[/\\]dist$/);
    expect(paths[1]).toMatch(/main[/\\]views$/);

    expect(options).toEqual({
      autoescape: true,
      watch: true,
      express: app,
    });

    expect(middleware).toBeDefined();
  });

  it('adds the current request path to response locals', () => {
    let middleware: RequestHandler | undefined;

    const app = {
      set: vi.fn(),
      use: vi.fn((handler: RequestHandler) => {
        middleware = handler;
      }),
    };

    new Nunjucks(false).enableFor(app as never);

    expect(middleware).toBeDefined();

    const req = {
      path: '/example',
    };

    const res = {
      locals: {},
    };

    const next = vi.fn() as NextFunction;

    middleware!(req as never, res as never, next);

    expect(res.locals).toEqual({
      pagePath: '/example',
    });
    expect(next).toHaveBeenCalledOnce();
  });
});
