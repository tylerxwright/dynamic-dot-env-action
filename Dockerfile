FROM node

WORKDIR /app
#COPY package.json dist/index.js ./
RUN npm install
ENTRYPOINT [ "node", "dist/index.js" ]