# ---- Base image ----
FROM hmctsprod.azurecr.io/base/node:24-alpine AS base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base AS build

RUN yarn install --immutable --inline-builds
RUN yarn build:prod

# ---- Runtime image ----
FROM base AS runtime

ENV NODE_ENV=production

COPY --from=build --chown=hmcts:hmcts $WORKDIR/node_modules ./node_modules
COPY --from=build --chown=hmcts:hmcts $WORKDIR/dist ./dist

# TODO: expose the right port for your application
EXPOSE 3100

CMD ["node", "--enable-source-maps", "dist/main/server.js"]