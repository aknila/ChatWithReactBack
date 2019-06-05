FROM node:10.15.3

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4300

ENV PORT=4300

CMD [ "npm", "start" ]