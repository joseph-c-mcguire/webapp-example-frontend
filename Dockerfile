# Stage 1: Build the React app
FROM node:14 AS build

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

ENV PORT=80
EXPOSE $PORT
ENTRYPOINT ["npm run serve"]