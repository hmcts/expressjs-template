import * as appInsights from 'applicationinsights';
import config from 'config';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppInsights } from '../../../../main/modules/appinsights';

vi.mock('config', () => ({
  __esModule: true,
  default: {
    has: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('applicationinsights', () => {
  const setupChain = {
    setSendLiveMetrics: vi.fn(),
    start: vi.fn(),
  };

  setupChain.setSendLiveMetrics.mockReturnValue(setupChain);

  return {
    setup: vi.fn(() => setupChain),
    defaultClient: {
      context: {
        tags: {},
        keys: {
          cloudRole: 'cloudRole',
        },
      },
      trackTrace: vi.fn(),
    },
  };
});

const configHas = vi.mocked(config.has);
const configGet = vi.mocked(config.get);
const setup = vi.mocked(appInsights.setup);
const trackTrace = vi.mocked(appInsights.defaultClient.trackTrace);

const originalConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

describe('AppInsights', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

    const cloudRoleKey = appInsights.defaultClient.context.keys.cloudRole;
    delete appInsights.defaultClient.context.tags[cloudRoleKey];
  });

  afterAll(() => {
    if (originalConnectionString === undefined) {
      delete process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    } else {
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = originalConnectionString;
    }
  });

  it('does not enable App Insights when no connection string is configured', () => {
    configHas.mockReturnValue(false);
    configGet.mockReturnValue(false);

    new AppInsights().enable();

    expect(setup).not.toHaveBeenCalled();
    expect(trackTrace).not.toHaveBeenCalled();
  });

  it('uses the standard environment connection string', () => {
    process.env.APPLICATIONINSIGHTS_CONNECTION_STRING = 'environment-connection-string';

    new AppInsights().enable();

    expect(configHas).not.toHaveBeenCalled();
    expect(configGet).not.toHaveBeenCalled();
    expect(setup).toHaveBeenCalledWith('environment-connection-string');
  });

  it('uses the Key Vault connection string', () => {
    configHas.mockReturnValue(true);
    configGet.mockReturnValue('secret-connection-string');

    new AppInsights().enable();

    expect(configGet).toHaveBeenCalledWith('secrets.rpe.AppInsightsConnectionString');
    expect(setup).toHaveBeenCalledWith('secret-connection-string');

    const setupChain = setup.mock.results[0].value;

    expect(setupChain.setSendLiveMetrics).toHaveBeenCalledWith(true);
    expect(setupChain.start).toHaveBeenCalled();

    const cloudRoleKey = appInsights.defaultClient.context.keys.cloudRole;

    expect(appInsights.defaultClient.context.tags[cloudRoleKey]).toBe('rpe-expressjs-template');
    expect(trackTrace).toHaveBeenCalledWith({
      message: 'App insights activated',
    });
  });

  it('falls back to the configured connection string', () => {
    configHas.mockReturnValue(false);
    configGet.mockReturnValue('fallback-connection-string');

    new AppInsights().enable();

    expect(configGet).toHaveBeenCalledWith('appInsights.connectionString');
    expect(setup).toHaveBeenCalledWith('fallback-connection-string');
  });
});
