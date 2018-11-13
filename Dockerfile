FROM node:8 as build-deps
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn
# Bundle app source
COPY . ./
RUN yarn build

FROM nginx:latest
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
