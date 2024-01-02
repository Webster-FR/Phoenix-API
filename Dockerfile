FROM node:21

WORKDIR /home/api

COPY package*.json ./
COPY prisma ./prisma/

# pas sur pour le .env
# COPY .env ./
COPY tsconfig.json ./

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3001

CMD npx prisma migrate deploy && npm start
