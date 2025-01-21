# Using Node.js to build the frontend
FROM node:18 AS build

# Specify the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire source code and build the application
COPY . .
RUN npm run build

# Using Nginx to Serve Static Files
FROM nginx:1.25

# Copy the builded frontend to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Opening the port
EXPOSE 80

# Nginx starts automatically