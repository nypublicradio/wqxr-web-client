FROM node:8.11-alpine

RUN \
    mkdir -p /code \
    && apk update \
    && apk add unzip
WORKDIR /code

COPY package.json ./
COPY yarn.lock ./
RUN yarn --prod

COPY . .
CMD node fastboot
