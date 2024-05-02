FROM node:20.10
COPY . .
RUN yarn install
RUN yarn build

CMD yarn start