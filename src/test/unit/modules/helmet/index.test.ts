import helmet from 'helmet';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Helmet } from '../../../../main/modules/helmet/index.js';

vi.mock('helmet', () => ({
  default: vi.fn(() => vi.fn()),
}));

interface HelmetOptions {
  contentSecurityPolicy: {
    directives: {
      connectSrc: string[];
      scriptSrc: string[];
      styleSrc: string[];
    };
  };
}

describe('Helmet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses a strict content security policy in production', () => {
    const app = {
      use: vi.fn(),
    };

    new Helmet(false).enableFor(app as never);

    const options = vi.mocked(helmet).mock.calls[0][0] as HelmetOptions;
    const directives = options.contentSecurityPolicy.directives;

    expect(directives.connectSrc).toEqual(["'self'"]);
    expect(directives.styleSrc).toEqual(["'self'"]);
    expect(directives.scriptSrc).toContain("'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='");
  });

  it('allows Vite development styles and websocket connections in development', () => {
    const app = {
      use: vi.fn(),
    };

    new Helmet(true).enableFor(app as never);

    const options = vi.mocked(helmet).mock.calls[0][0] as HelmetOptions;
    const directives = options.contentSecurityPolicy.directives;

    expect(directives.connectSrc).toContain('wss://localhost:*');
    expect(directives.styleSrc).toContain("'unsafe-inline'");
  });
});
