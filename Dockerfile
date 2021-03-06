FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY config.json ./
COPY dist .
RUN npm install
COPY . .
CMD ["node", "src/main.js"]