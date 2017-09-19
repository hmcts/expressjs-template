# Express application template

[![Build Status](https://travis-ci.org/hmcts/expressjs-template.svg?branch=master)](https://travis-ci.org/hmcts/expressjs-template)

## Purpose

The purpose of this template is to speed up the creation of new [Express](http://expressjs.com/) frontend
applications within HMCTS and help keep the same development standards across multiple teams.
If you need to create a new application, you can simply use this one as a starting point and build on top of it.

## What's inside

The template is a working application with a minimal setup. It contains:
  * application skeleton
  * common dependencies
  * static analysis set up
  * integration with Travis CI
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

### TODO: Docker

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
