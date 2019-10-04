# Base image
FROM node:alpine

# Bcrypt dependency
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
    npm install --quiet node-gyp -g

# Container working directory
WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy directory
COPY . .

# Default command
CMD [ "npm", "run", "start"]