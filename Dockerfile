
FROM mhart/alpine-node:9.9.0

RUN mkdir /app
RUN mkdir ./app/logs
COPY package.json /app/package.json
WORKDIR /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD npm start
