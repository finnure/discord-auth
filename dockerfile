FROM node:16 as build
COPY package.json /build/klauvi/
WORKDIR /build/klauvi
RUN npm install
COPY . /build/klauvi/
RUN npm run build

FROM node:16-alpine
COPY --from=build /build/klauvi/lib /opt/klauvi/lib
COPY --from=build /build/klauvi/node_modules /opt/klauvi/node_modules
COPY package.json /opt/klauvi/
COPY ./dist /opt/klauvi/dist
WORKDIR /opt/klauvi
EXPOSE 8080

CMD [ "npm", "run", "prod" ]
