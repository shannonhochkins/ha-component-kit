ARG BUILD_FROM
ARG BUILD_ARCH
ARG BUILD_VERSION
FROM $BUILD_FROM

ARG BUILD_ARCH
ARG BUILD_VERSION

LABEL \
  io.hass.type="addon" \
  io.hass.arch="${BUILD_ARCH}" \
  io.hass.version="${BUILD_VERSION}"

WORKDIR /usr/app
# Install nodejs and npm
RUN apk add --no-cache nodejs npm
# Check versions of node and npm
RUN node --version
RUN npm --version
# Copy the package.json and package-lock.json (if available)
COPY package*.json ./
# Copy application dependencies
COPY tsconfig.json ./
COPY server /usr/app/server
COPY services.d /etc/services.d
RUN echo "Installing dependencies"
# Set the environment to production
ENV NODE_ENV=production
# Install dependencies
RUN npm ci
RUN echo "Building Addon"
# Attempt to build the application, with output for debugging
RUN npm run build
# Expose the port the app runs on
EXPOSE 2022
RUN echo "Starting addon"
# Make the server run script executable
RUN chmod +x /etc/services.d/server/run

