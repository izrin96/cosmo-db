FROM oven/bun

WORKDIR /usr/src/app

COPY package.json ./
RUN apt update && apt install python3 python3-pip make g++ -y
RUN bun install
COPY . .

ENV NODE_ENV production

RUN bun build ./src/http/gravity-api/server.ts --outdir ./dist --target bun
RUN mv ./dist/server.js ./dist/gravity-api-server.js
CMD ["bun", "run", "dist/gravity-api-server.js"]