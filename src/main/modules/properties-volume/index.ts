import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import type { Application } from 'express';

export class PropertiesVolume {
  enableFor(app: Application): void {
    if (app.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
    }
  }
}
