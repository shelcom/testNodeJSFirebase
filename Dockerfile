# Use the official lightweight Node.js image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port the app will run on
EXPOSE 8080

# Command to run the app
CMD ["npm", "run", "start:prod"]