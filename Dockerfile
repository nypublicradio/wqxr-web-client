FROM node:10.6-alpine
RUN mkdir -p /code \
    && apk update \
    && apk add  \
        unzip
WORKDIR /code
COPY package.json ./
COPY yarn.lock ./
RUN yarn --prod --pure-lockfile

COPY . .
CMD node fastboot
