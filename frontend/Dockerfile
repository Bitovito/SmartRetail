FROM node:22

WORKDIR /app

# copy lock + manifest first for better caching
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]