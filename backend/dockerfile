FROM node:24
workdir /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
