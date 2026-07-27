import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import * as nunjucks from 'nunjucks';

import { Nunjucks } from '../../../../main/modules/nunjucks';

jest.mock('nunjucks', () => ({
  configure: jest.fn(),
}));

describe('Nunjucks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.each([true, false])('configures Nunjucks when development mode is %s', developmentMode => {
    let middleware: RequestHandler | undefined;

    const app = {
      set: jest.fn(),
      use: jest.fn((handler: RequestHandler) => {
        middleware = handler;
      }),
    } as unknown as Express;

    new Nunjucks(developmentMode).enableFor(app);

    expect(app.set).toHaveBeenCalledWith('view engine', 'njk');

    const configure = jest.mocked(nunjucks.configure);

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

    const next = jest.fn() as NextFunction;

    middleware?.(req, res, next);

    expect(res.locals.pagePath).toBe('/example-page');
    expect(next).toHaveBeenCalledTimes(1);
  });
});
