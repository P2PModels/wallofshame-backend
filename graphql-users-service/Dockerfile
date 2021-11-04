FROM node:12-alpine

WORKDIR /app
COPY . .

RUN npm install --production
RUN npm run build

EXPOSE 4001

# CMD ["node", "dist/server"]
CMD ["/bin/sh", "./scripts/init_container.sh"]


