FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

RUN corepack enable
RUN apk --no-cache add gzip

COPY package*.json yarn*.lock ./
COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "start:prod"]
