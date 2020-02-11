import {fail} from "assert";

const pa11y = require('pa11y')
import * as supertest from "supertest";
import {app} from "../../main/app";

const agent = supertest.agent(app);


class Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];
}

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

describe("Accessibility", () => {

  // testing accessibility of the home page
  testAccessibility("/");

  // TODO: include each path of your application in accessibility checks
});

function testAccessibility(url: string): void {

  describe(`Page ${url}`, () => {

    it("should have no accessibility errors", (done) => {
      ensurePageCallWillSucceed(url)
        .then(() => pa11y(agent.get(url).url))
        .then((result: Pa11yResult) => {
          expectNoErrors(result.issues);
          done();
        })
        .catch((err) => done(err));
    });
  });
}

function ensurePageCallWillSucceed(url: string): Promise<void> {
  return agent.get(url)
    .then((res: supertest.Response) => {
      if (res.redirect) {
        throw new Error(`Call to ${url} resulted in a redirect to ${res.get("Location")}`);
      }
      if (res.serverError) {
        throw new Error(`Call to ${url} resulted in internal server error`);
      }
    });
}

function expectNoErrors(messages : PallyIssue[]) {
  const errors = messages.filter((m) => m.type === "error");

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}
