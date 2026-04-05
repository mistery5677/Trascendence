1-> sudo apt install npm
Note: Install the Node package manager wich contains JavaScript library

2-> Root path run the command "npm create vite@latest frontend -- --template react-ts" (Creates the frontend folder)
3-> Root path run the command "npx @nestjs/cli new backend --package-manager npm" (Creates the backend folder)
Note: Node package Executor allows to execute Node.js commands without the need to install permanently

3 -> Inside the backend folder, run the commands (https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/introduction):
npm install prisma --save-dev (Install the prisma with the dev dependecy, garants that CLI is lighter)
npx prisma init (Creates the prisma structure)