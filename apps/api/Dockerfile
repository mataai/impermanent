# Use official Node.js LTS image
FROM node:20-alpine

ENV MEDIA_ROOT=/media

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source
COPY ./dist/apps/api/ .

# Expose port (default Express port)
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
