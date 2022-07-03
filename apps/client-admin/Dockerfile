FROM node:18

WORKDIR /app
COPY /apps/client-admin/package.json .

RUN npm install

COPY /apps/client-admin/. .

CMD npm run start