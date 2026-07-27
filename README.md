# Express.js application template

A minimal HMCTS template for building server-rendered frontend applications with Express, TypeScript, Nunjucks and GOV.UK Frontend.

The template provides a working application skeleton and a set of development, build, test and deployment conventions. Teams should adapt the sample routes, checks, configuration and documentation for their service.

## What is included

- Express 5 application written in TypeScript
- Nunjucks views and GOV.UK Frontend assets
- compiled JavaScript for production execution
- local HTTPS development
- Helmet security headers
- request rate limiting
- HMCTS health endpoint integration
- Application Insights and HMCTS logging integration
- unit, route, accessibility, smoke and functional tests
- Playwright browser testing
- Docker and HMCTS pipeline configuration
- Yarn 4 Plug'n'Play and immutable installs
- ESLint, Stylelint and Prettier checks

## Initialise the service

Run:

```bash
./bin/init.sh
```

Enter the application port, product name and component name when prompted.

The script updates the template references, renames the Helm chart and removes files that are only needed by the template.

Check for any remaining template references:

```bash
git grep -n \
  -e 'rpe-expressjs-template' \
  -e 'expressjs-template'
```

Then install dependencies and run the application:

```bash
yarn install
yarn start:dev
```

## Requirements

- Node.js 22.13.0 or later
- Corepack
- Docker and Docker Compose, when using the container workflow

Check the active Node.js version:

```bash
node --version
```

Enable Corepack and install the pinned Yarn version:

```bash
corepack enable
yarn install --immutable
```

The repository pins Yarn through the `packageManager` field in `package.json`.

## Running locally

Start the application in development mode:

```bash
yarn start:dev
```

The application is available at:

```text
https://localhost:3100
```

The development command generates local TLS options before starting the TypeScript server with Nodemon. The locally generated certificate is intended only for development and testing.

Nodemon watches the files under `src/main` and restarts the server when relevant source files change.

## Production-style build and startup

Build the frontend assets and compile the server:

```bash
yarn build
```

Start the compiled application:

```bash
yarn start
```

The production process runs:

```text
dist/main/server.js
```

TypeScript is compiled during the build and is not executed through `ts-node` in production.

The build performs the following steps:

1. removes the previous `dist` directory;
2. builds minified and fingerprinted frontend assets with Webpack;
3. compiles the server with TypeScript;
4. copies the Nunjucks views and public assets into `dist`.

## Common commands

| Command                       | Purpose                                                 |
| ----------------------------- | ------------------------------------------------------- |
| `yarn start:dev`              | Start the local HTTPS development server with Nodemon   |
| `yarn build`                  | Build production frontend assets and compile the server |
| `yarn start`                  | Run the compiled production application                 |
| `yarn typecheck`              | Type-check the project without emitting files           |
| `yarn lint`                   | Run Stylelint, ESLint and Prettier checks               |
| `yarn lint:fix`               | Apply Prettier and ESLint fixes                         |
| `yarn test`                   | Run the unit tests                                      |
| `yarn test:routes`            | Run the Express route tests                             |
| `yarn test:a11y`              | Run automated accessibility tests                       |
| `yarn test:functional`        | Run the Playwright functional tests                     |
| `yarn test:functional:headed` | Run Playwright with a visible browser                   |
| `yarn test:functional:debug`  | Run Playwright in debug mode                            |
| `yarn test:smoke`             | Run the smoke tests against the local HTTPS application |
| `yarn test:coverage`          | Run Jest with coverage                                  |
| `yarn cichecks`               | Run the checks expected before a pull request           |

## Testing

### Unit tests

Unit tests use Jest and are located under `src/test/unit`.

```bash
yarn test
```

The sample unit test exists only to demonstrate the expected structure and should be replaced with tests for the consuming service.

### Route tests

Route tests use Jest and Supertest and are located under `src/test/routes`.

```bash
yarn test:routes
```

Route tests should cover the application responses and middleware behaviour without requiring a browser.

### Accessibility tests

Automated accessibility tests use Axe with Playwright.

```bash
yarn test:a11y
```

The template includes a baseline accessibility test for the home page. Services must extend this coverage to include their important user journeys and page states.

Automated checks do not replace manual accessibility testing.

### Functional tests

Functional browser tests use Playwright Test and are located under `src/test/functional`.

Install the matching Chromium browser binary after installing or upgrading Playwright:

```bash
yarn playwright install chromium
```

Run the functional tests:

```bash
yarn test:functional
```

By default, Playwright starts the local application and waits for its health endpoint before running the tests. When `TEST_URL` is set, Playwright tests that environment instead and does not start a local server.

Examples:

```bash
TEST_URL=https://example.test yarn test:functional
TEST_HEADLESS=false yarn test:functional
TEST_SLOW_MO=250 yarn test:functional
```

Functional test reports and failure artefacts are written under `functional-output`.

### Smoke tests

The smoke test uses the locally generated certificate as an additional trusted certificate:

```bash
yarn test:smoke
```

Smoke-test output is written under `smoke-output`.

### Complete checks

Run the normal pre-pull-request checks with:

```bash
yarn cichecks
```

This performs an immutable install, type-checks the project, builds it, runs linting, and executes the unit, route, accessibility and functional tests.

## Project structure

```text
src/main/
  assets/       Frontend TypeScript and Sass
  modules/      Application integrations and middleware
  public/       Generated and static public assets
  routes/       Express routes
  views/        Nunjucks templates
  server.ts     Server entry point

src/test/
  a11y/         Automated accessibility tests
  functional/   Playwright functional tests
  routes/       Express route tests
  smoke/        Smoke tests
  unit/         Unit tests
```

Generated output is written to:

```text
dist/
functional-output/
smoke-output/
```

These directories should not be committed.

## Configuration

Runtime configuration uses the [`config`](https://www.npmjs.com/package/config) package.

Default configuration is stored under:

```text
config/default.json
```

Services should add environment-specific configuration following HMCTS conventions and must not commit secrets.

Properties mounted into `/mnt/secrets/` can be loaded through the HMCTS properties-volume integration.

## Security

### Security headers

The application uses Helmet to add security-related HTTP headers.

Review the configuration under `config` when creating a service. Content Security Policy and other security controls must reflect the resources and integrations used by that service.

The template also includes request rate limiting. Teams must confirm that its limits and proxy configuration are appropriate for their deployment.

### CSRF protection

CSRF protection is not enabled by this minimal template because the appropriate implementation depends on the application's authentication and session model.

Before adding browser-accessible `POST`, `PUT`, `PATCH` or `DELETE` routes that rely on automatically submitted credentials such as cookies, the service must:

- threat-model the interaction;
- select the approved HMCTS CSRF pattern for its session model;
- protect all relevant routes;
- define any necessary route exemptions explicitly;
- add tests for valid, missing and invalid tokens.

Do not assume that `SameSite` cookies or authentication through IDAM removes the need to assess CSRF. The frontend remains responsible for protecting requests authenticated through its own browser session or cookies.

### Secrets

Do not commit credentials, private keys or production certificates.

The certificates generated under `src/main/resources/localhost-ssl` are for local development only and should be excluded from Docker build contexts and source control where appropriate.

## Health endpoint

The application exposes:

```text
https://localhost:3100/health
```

The endpoint is provided through `@hmcts/nodejs-healthcheck`.

The template health configuration is a starting point. Consuming services must replace or supplement sample checks with checks that reflect their actual dependencies and operational requirements.

Build information should be supplied by the deployment process so the health response can identify the deployed version and commit.

## Logging and telemetry

The template currently includes HMCTS Node.js logging and Application Insights integration.

Consuming services must review:

- log levels and structured fields;
- sensitive-data redaction;
- request and correlation identifiers;
- Application Insights configuration;
- the current HMCTS observability standard.

Do not log secrets, authentication tokens, session identifiers or sensitive personal information.

## Dependency auditing

Run a production dependency audit with:

```bash
yarn npm audit --environment production
```

A clean result is:

```text
No audit suggestions
```

Any checked-in audit baseline must be reviewed when dependencies change. Do not retain an exception for a package that is no longer present.

## Docker

Build and run the application with Docker Compose:

```bash
docker compose build
docker compose up
```

The application is exposed on port `3100`.

Verify the health endpoint after startup:

```text
https://localhost:3100/health
```

The production container should run the compiled JavaScript from `dist`, not the TypeScript source.

## Creating a service from the template

When adopting this template:

1. replace the package name and application metadata;
2. replace the sample page, route and tests;
3. configure service-specific health checks;
4. review Helmet, rate-limit and proxy settings;
5. decide the authentication, session and CSRF architecture before adding authenticated state-changing routes;
6. configure logging, telemetry and redaction;
7. update Docker, chart and pipeline metadata;
8. extend accessibility and functional coverage to the service's important journeys;
9. rewrite this README for the resulting service.

## Contributing

Before opening a pull request:

```bash
yarn cichecks
yarn npm audit --environment production
git diff --check
```

Keep generated output, local certificates and secrets out of commits.

## Licence

This project is licensed under the MIT Licence. See [LICENSE](LICENSE).
