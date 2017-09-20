# Express application template

[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/expressjs-template.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/hmcts/expressjs-template.svg?branch=master)](https://travis-ci.org/hmcts/expressjs-template)

## Purpose

The purpose of this template is to speed up the creation of new [Express](http://expressjs.com/) frontend
applications within HMCTS and help keep the same development standards across multiple teams.
If you need to create a new application, you can simply use this one as a starting point and build on top of it.

## What's inside

The template is a working application with a minimal setup. It contains:
  * application skeleton
  * common dependencies
  * Docker setup
  * static analysis set up
  * integration with Travis CI
  * HTTPS set up for development environment
  * MIT license and contribution information

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

  * [Node.js](https://nodejs.org/) v7.2.0 or later
  * [yarn](https://yarnpkg.com/)
  * [Gulp](http://gulpjs.com/)
  * [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```

Run:

```bash
$ gulp
```

The applications's home page will be available at https://localhost:3100

### Running with Docker

Create docker image:

```bash
  docker-compose build
```

Run the application by executing the following command:

```bash
  docker-compose up
```

This will start the frontend container exposing the application's port
(set to `3100` in this template app).

In order to test if the application is up, you can visit http://localhost:3100 in your browser.
You should get a very basic home page (no styles, etc.).

## Developing

### Code style

We use [TSLint](https://palantir.github.io/tslint/) with their recommended set of rules
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
```bash
$ yarn lint`
```

### Running the tests

This template app uses [Mocha](https://mochajs.org/) as the test engine. You can rununit tests by executing
the following command:

```bash
$ yarn test
```

Here's how to run functional tests (the template contains just one sample test):
```bash
$ yarn test:routes
```

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
{% from "macros/csrf.njk" import csrfProtection %}
...
<form ...>
  ...
    {{ csrfProtection(csrfToken) }}
  ...
</form>
...
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
