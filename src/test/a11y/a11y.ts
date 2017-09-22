import {fail} from "assert";
import * as promisify from "es6-promisify";
import * as pa11y from "pa11y";
import * as supertest from "supertest";
import {app} from "../../main/app";

const agent = supertest.agent(app);
const pa11yTest = pa11y();
const test = promisify(pa11yTest.run, pa11yTest);

describe("Accessibility", () => {

  // testing accessibility of the home page
  testAccessibility("/");

  // TODO: include each path of your application in accessibility checks
});

function testAccessibility(url: string): void {

  describe(`Page ${url}`, () => {

    it("should have no accessibility errors", (done) => {
      ensurePageCallWillSucceed(url)
        .then(() =>
          test(agent.get(url).url),
        )
        .then((messages) => {
          expectNoErrors(messages);
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

function expectNoErrors(messages) {
  const errors = messages.filter((m) => m.type === "error");

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}
