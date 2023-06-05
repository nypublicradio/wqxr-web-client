FROM node:14.21-bullseye
RUN mkdir -p /code \
    && apt-get autoclean \
    && apt-get update -y \
    && apt-get install -y \
        unzip
WORKDIR /code
COPY package.json ./
COPY yarn.lock ./
RUN yarn --prod --pure-lockfile

COPY . .
CMD node fastboot
