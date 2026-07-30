import type { Express } from 'express';
import helmet from 'helmet';

const googleAnalyticsDomain = '*.google-analytics.com';
const self = "'self'";
const govukFrontendScriptHash = "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='";

export class Helmet {
  constructor(private readonly developmentMode: boolean) {}

  public enableFor(app: Express): void {
    const connectSrc = [self];
    const styleSrc = [self];

    if (this.developmentMode) {
      connectSrc.push('wss://localhost:*');
      styleSrc.push("'unsafe-inline'");
    }

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            connectSrc,
            defaultSrc: ["'none'"],
            fontSrc: [self, 'data:'],
            imgSrc: [self, googleAnalyticsDomain],
            objectSrc: [self],
            scriptSrc: [self, googleAnalyticsDomain, govukFrontendScriptHash],
            styleSrc,
          },
        },
        referrerPolicy: { policy: 'origin' },
      })
    );
  }
}
