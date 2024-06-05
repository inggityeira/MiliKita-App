# Use the official Node.js 14 image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY review.js ./

# Expose the port the app runs on
EXPOSE 5000

# Start the application with nodemon
CMD ["npx", "nodemon", "review.js"]
