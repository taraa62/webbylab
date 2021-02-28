FROM node:14.15.3

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./dist ./dist

EXPOSE 8082

CMD ["npm", "run", "start:prod"]
