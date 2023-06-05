FROM node:10.6-alpine
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
