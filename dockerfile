# Use the latest Node.js LTS version
FROM node:lts

# Install necessary packages and fonts
RUN apt-get update && \
    apt-get install -y pandoc fonts-liberation gnupg wget && \
    rm -rf /var/lib/apt/lists/*

# Set Puppeteer environment to skip the bundled Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV HOME=/usr/src/app

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Create an output directory with appropriate permissions
RUN mkdir -p /usr/src/app/out

# Set working directory
WORKDIR /usr/src/app

# Only copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the remaining files (excluding `src`) required for the application code
COPY . .

# Run the build script directly as CMD
CMD ["node", "index.js"]