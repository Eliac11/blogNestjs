FROM node:20.10
COPY ./nest-cli.json ./package-lock.json ./package.json ./tsconfig.build.json ./tsconfig.json ./yarn.lock ./prisma ./
RUN yarn install
COPY . .
RUN yarn build

CMD yarn start