FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN REACT_APP_API_URL=http://192.168.1.4:5000 npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
