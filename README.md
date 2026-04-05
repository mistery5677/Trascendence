Technologies used:

-> Frontend: React
-> Backend: NestJS
-> Data base: PostgreSQL

About PostgreSQL

We use the PostgreSQL as our data base because it is an ORM (Object-Relational Mapping), this way we can manipulate the data like we do in C#, java or Python, instead of SQL complexes researches, making the code better readable.

To connect with SQL we create the "prisma.service.ts" in the backend folder, and we add the PostgreSQL to app.module to recognise all the classes for SQL

IMPORTANT COMMANDS:
--> npm install dotenv (Reads and extract all the information from the file '.env')
--> npx prisma generate (Creates a new data for the Data base, basically whenever we create a new class or something else we need to use this command to update the "dictionary") / make generate does the same thing
--> docker restart chess_backend (Restart the backend docker if needed)
--> docker exec -it chess_backend npm install @prisma/client (install and updates the files inside the chess_backend docker)

Enter in docker execution for database
--> docker exec -it chess_database psql -U transcendence_admin -d transcendence_db (You can see the credentials on .env file)

Test data base
--> curl -X POST http://localhost:3000/users
