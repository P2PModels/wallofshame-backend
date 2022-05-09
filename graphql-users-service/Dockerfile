FROM node:12-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE $PORT

CMD ["/bin/sh", "./scripts/init_container.sh"]


