    # Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /src

# Install dependencies first (better caching)
COPY package*.json yarn.lock* ./ 
RUN yarn install --frozen-lockfile || npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN yarn build || npm run build

# Expose port
EXPOSE 4000

# Run with ts-node in dev or built JS in prod
CMD ["node", "dist/main.js"]
