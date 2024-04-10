FROM node:20.9.0-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8085

CMD [ "yarn", "start" ]
