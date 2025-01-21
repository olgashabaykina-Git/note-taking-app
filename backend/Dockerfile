# Using a base Node.js 
FROM node:18

# Specify the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copy all the project code into the container
COPY . .

# Open the port used by the application
EXPOSE 5001

# КCommand to run the application
CMD ["node", "app.js"]
