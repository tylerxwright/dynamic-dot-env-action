FROM node:buster

COPY . /app

WORKDIR /gh
RUN apt-get update && apt-get install -y \ 
    software-properties-common \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 \
    && apt-add-repository https://cli.github.com/packages \
    && apt update \
    && apt install gh

WORKDIR /app
#COPY package.json dist/index.js ./
RUN npm install
ENTRYPOINT [ "node", "index.js" ]