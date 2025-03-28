# Use the official Node.js image with Alpine as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json (if available)
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (adjust if necessary)
EXPOSE 8000

# Define the command to run the application
CMD ["npm", "run", "start"]