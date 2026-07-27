import * as appInsights from 'applicationinsights';
import config from 'config';

import { AppInsights } from '../../../../main/modules/appinsights';

jest.mock('config', () => ({
  __esModule: true,
  default: {
    has: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('applicationinsights', () => {
  const setupChain = {
    setSendLiveMetrics: jest.fn(),
    start: jest.fn(),
  };

  setupChain.setSendLiveMetrics.mockReturnValue(setupChain);

  return {
    setup: jest.fn(() => setupChain),
    defaultClient: {
      context: {
        tags: {},
        keys: {
          cloudRole: 'cloudRole',
        },
      },
      trackTrace: jest.fn(),
    },
  };
});

const configHas = config.has as jest.Mock;
const configGet = config.get as jest.Mock;
const setup = appInsights.setup as jest.Mock;
const trackTrace = appInsights.defaultClient.trackTrace as jest.Mock;

describe('AppInsights', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const cloudRoleKey = appInsights.defaultClient.context.keys.cloudRole;
    delete appInsights.defaultClient.context.tags[cloudRoleKey];
  });

  it('does not enable App Insights when no instrumentation key is configured', () => {
    configHas.mockReturnValue(false);
    configGet.mockReturnValue(false);

    new AppInsights().enable();

    expect(setup).not.toHaveBeenCalled();
    expect(trackTrace).not.toHaveBeenCalled();
  });

  it('enables App Insights using the secret instrumentation key', () => {
    configHas.mockReturnValue(true);
    configGet.mockReturnValue('secret-instrumentation-key');

    new AppInsights().enable();

    expect(configGet).toHaveBeenCalledWith('secrets.rpe.AppInsightsInstrumentationKey');
    expect(setup).toHaveBeenCalledWith('secret-instrumentation-key');

    const setupChain = setup.mock.results[0].value;

    expect(setupChain.setSendLiveMetrics).toHaveBeenCalledWith(true);
    expect(setupChain.start).toHaveBeenCalled();

    const cloudRoleKey = appInsights.defaultClient.context.keys.cloudRole;

    expect(appInsights.defaultClient.context.tags[cloudRoleKey]).toBe('rpe-expressjs-template');
    expect(trackTrace).toHaveBeenCalledWith({
      message: 'App insights activated',
    });
  });

  it('falls back to the standard instrumentation key', () => {
    configHas.mockReturnValue(false);
    configGet.mockReturnValue('fallback-instrumentation-key');

    new AppInsights().enable();

    expect(configGet).toHaveBeenCalledWith('appInsights.instrumentationKey');
    expect(setup).toHaveBeenCalledWith('fallback-instrumentation-key');
  });
});
