/// <reference types='codeceptjs-timja-temp-fork' />

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
  }
  interface Methods extends Puppeteer {}
  interface I extends WithTranslation<Methods> {
    // Copy from as needed, till we figure out how to fix this properly
    // https://github.com/codeceptjs/CodeceptJS/blob/3.x/typings/index.d.ts
    // hopefully will be resolved when:
    // https://github.com/codeceptjs/CodeceptJS/pull/3413
    // and https://github.com/codeceptjs/configure/pull/32
    // are released, and we can switch back to upstream
    amOnPage(url: string): void;
    waitInUrl(urlPart: string, sec?: number): void;
    waitForText(text: string, sec?: number, context?: CodeceptJS.LocatorOrString): void;
    see(text: string, context?: CodeceptJS.LocatorOrString): void;
  }
  namespace Translation {
    interface Actions {}
  }
}
