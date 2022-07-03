FROM node:18

WORKDIR /app
COPY /apps/backend-api/package.json .

RUN npm install -g @nestjs/cli

RUN npm install

COPY /apps/backend-api/. .

CMD npm run start:dev