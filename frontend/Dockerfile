# frontend/Dockerfile
# Fonts to find the prefixes and theirs meanings "https://docs.docker.com/reference/dockerfile/"

FROM node:20-alpine

# Creates the working directory for the bind mounts
WORKDIR /usr/src/app

# Copy the dependencies files (Builds faster)
COPY package*.json ./

# Install the dependecies
RUN npm install

# Copy the code
COPY . .


EXPOSE 5173

# Command to start the dev server
CMD ["npm", "run", "dev", "--", "--host"]