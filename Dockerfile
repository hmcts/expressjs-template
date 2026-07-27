# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:22-alpine AS base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base AS build

RUN yarn build:prod

# ---- Runtime image ----
FROM base AS runtime

COPY --from=build --chown=hmcts:hmcts $WORKDIR/dist ./dist
# TODO: expose the right port for your application
EXPOSE 3100
