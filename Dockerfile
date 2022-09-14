# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base as build

# the yarn install is needed for some reason in Docker even with zero-install, it's very quick though
RUN PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=true \
    PUPPETEER_SKIP_DOWNLOAD=true \
    yarn install --immutable-cache && \
    yarn build:prod && \
    rm -rf webpack/ webpack.config.js

# ---- Runtime image ----
FROM base as runtime

COPY --from=build $WORKDIR/src/main ./src/main
# TODO: expose the right port for your application
EXPOSE 3100
