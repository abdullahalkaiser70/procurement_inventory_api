FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build || true

# Expose port
EXPOSE 4040

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 CMD node -e "require('http').get('http://localhost:4040/api/v1/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
