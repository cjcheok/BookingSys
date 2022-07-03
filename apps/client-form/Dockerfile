FROM node:18

WORKDIR /app
COPY /apps/client-form/package.json .

RUN npm install

COPY /apps/client-form/. .

CMD npm run dev