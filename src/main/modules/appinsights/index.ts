import appInsights from 'applicationinsights';
import config from 'config';

const cloudRoleName = 'rpe-expressjs-template';

export class AppInsights {
  enable(): void {
    const connectionString =
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
      (config.has('secrets.rpe.AppInsightsConnectionString')
        ? config.get<string>('secrets.rpe.AppInsightsConnectionString')
        : config.get<string | false>('appInsights.connectionString'));

    if (!connectionString) {
      return;
    }

    appInsights.setup(connectionString).setSendLiveMetrics(true).start();

    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = cloudRoleName;

    appInsights.defaultClient.trackTrace({
      message: 'App insights activated',
    });
  }
}
