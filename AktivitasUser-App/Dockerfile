# Use the official Node.js 14 image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy all the files to the container
COPY . .

# Expose the port the app runs on
EXPOSE 5004

# Start the application with nodemon
CMD ["nodemon", "aktivitas.js"]