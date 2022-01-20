# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:16-alpine as base
COPY --chown=hmcts:hmcts . .
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build

USER root
# Remove when switched to dart-sass
RUN apk add --update --no-cache python3
USER hmcts

RUN PUPPETEER_SKIP_DOWNLOAD=true yarn install && yarn build:prod

# ---- Runtime image ----
FROM base as runtime
RUN rm -rf webpack/ webpack.config.js
COPY --from=build $WORKDIR/src/main ./src/main
# TODO: expose the right port for your application
EXPOSE 3100
