# backend/Dockerfile
# Fonts to find the prefixes and theirs meanings "https://docs.docker.com/reference/dockerfile/"

FROM node:20-alpine

# Creates the working directory for the bind mounts
WORKDIR /usr/src/app

# Copy the dependencies files (Builds faster)
COPY package*.json ./

RUN npm install
# Install the dependecies
RUN apk add --no-cache \
  make \
  g++ \
  libstdc++ \
  git \
  wget

# Copy the code
COPY . .

# RUN apk add --no-cache make g++ libstdc++ \
#   && make -C ./assets/Stockfish/src clean \
#   && find ./assets/Stockfish/src -type f \( -name "*.o" -o -name "*.d" \) -delete \
#   && make -C ./assets/Stockfish/src -j$(nproc) build \
#   && install -m 0755 ./assets/Stockfish/src/stockfish /usr/bin/stockfish

RUN chmod +x ./assets/Stockfish/bin/stockfish \
  && install -m 0755 ./assets/Stockfish/bin/stockfish /usr/bin/stockfish

ENV STOCKFISH_PATH=/usr/bin/stockfish

EXPOSE 3000

# Command to start the dev server
CMD ["npm", "run", "start:dev"]