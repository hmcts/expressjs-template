import config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {

  enableFor(server: Application) {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);

      if (config.has('secrets.rpe.AppInsightsInstrumentationKey')) {
        set(config, 'appInsights.instrumentationKey', get(config, 'secrets.rpe.AppInsightsInstrumentationKey'));
      }
    }
  }
}
