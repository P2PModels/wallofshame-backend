FROM node:12-alpine

WORKDIR /app
COPY . .

RUN npm install --production
RUN npm run build

EXPOSE $PORT

CMD ["node", "./dist/server.js"]
# CMD ["/bin/sh", "./scripts/init_container.sh"]



