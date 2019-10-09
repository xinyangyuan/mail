# STAGE 1:
# Base image
FROM node:alpine as builder

# Container working directory
WORKDIR /usr/app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy directory
COPY . .

# Default command
RUN npm run build:production

# STAGE 2:
# Base image
FROM nginx

# Port
EXPOSE 4200

# Default conf (over-written file default.conf)
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Overwrite directory
COPY --from=builder /usr/app/dist/mail /usr/share/nginx/html
