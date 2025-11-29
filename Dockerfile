FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.29.3
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




# Conteneur temporaire 
# docker run -p 8080:80 klumer-frontend
# docker build -t klumer-frontend .


# Conteneur permanent 
# docker run -d --name klumer-app -p 8080:80 klumer-frontend
# docker start klumer-app
