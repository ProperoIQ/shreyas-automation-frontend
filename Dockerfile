# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies to ensure Tailwind CSS is installed)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on (default is 3000 for Next.js)
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
