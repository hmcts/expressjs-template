import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import * as nunjucks from 'nunjucks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Nunjucks } from '../../../../main/modules/nunjucks';

vi.mock('nunjucks', () => ({
  configure: vi.fn(),
}));

describe('Nunjucks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([true, false])('configures Nunjucks when development mode is %s', developmentMode => {
    let middleware: RequestHandler | undefined;

    const app = {
      set: vi.fn(),
      use: vi.fn((handler: RequestHandler) => {
        middleware = handler;
      }),
    } as unknown as Express;

    new Nunjucks(developmentMode).enableFor(app);

    expect(app.set).toHaveBeenCalledWith('view engine', 'njk');

    const configure = vi.mocked(nunjucks.configure);

    expect(configure).toHaveBeenCalledTimes(1);

    const [templatePaths, options] = configure.mock.calls[0];

    expect(templatePaths).toEqual([
      expect.stringMatching(/[\\/]govuk-frontend[\\/]dist$/),
      expect.stringMatching(/[\\/]main[\\/]views$/),
    ]);

    expect(options).toEqual({
      autoescape: true,
      watch: developmentMode,
      express: app,
    });

    expect(middleware).toBeDefined();

    const req = {
      path: '/example-page',
    } as Request;

    const res = {
      locals: {},
    } as Response;

    const next = vi.fn() as NextFunction;

    middleware?.(req, res, next);

    expect(res.locals.pagePath).toBe('/example-page');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
