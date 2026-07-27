import * as appInsights from 'applicationinsights';
import config from 'config';

export class AppInsights {
  enable(): void {
    const instrumentationKey = config.has('secrets.rpe.AppInsightsInstrumentationKey')
      ? config.get<string>('secrets.rpe.AppInsightsInstrumentationKey')
      : config.get<string | false>('appInsights.instrumentationKey');

    if (!instrumentationKey) {
      return;
    }

    appInsights.setup(instrumentationKey).setSendLiveMetrics(true).start();

    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'rpe-expressjs-template';

    appInsights.defaultClient.trackTrace({
      message: 'App insights activated',
    });
  }
}
