FROM node:21

WORKDIR /home

COPY package*.json ./
COPY prisma ./prisma/

# pas sur pour le .env
# COPY .env ./
COPY tsconfig.json ./

COPY . .

RUN mkdir -p /home/keys

RUN npm install -g pnpm
RUN pnpm install

RUN npx prisma generate --schema=prisma/production/schema.prisma

EXPOSE 3001

CMD npx prisma migrate deploy --schema=prisma/production/schema.prisma && npx prisma db seed && pnpm start
