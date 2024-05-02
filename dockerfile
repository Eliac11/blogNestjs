FROM node:20.10 as builder
WORKDIR /

FROM builder
WORKDIR /app
COPY ./package.json ./yarn.lock* ./
RUN yarn install
ADD ./ ./
RUN yarn build

CMD yarn start