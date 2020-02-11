FROM hmctspublic.azurecr.io/base/node:12-alpine

COPY --chown=hmcts:hmcts . .
RUN yarn install && yarn sass && rm -r node_modules/ && yarn install --production && rm -r ~/.cache/yarn

# TODO: expose the right port for your application
EXPOSE 3100
