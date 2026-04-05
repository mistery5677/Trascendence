all: up

up:
	docker compose up --build

# Builds the docker, with the option to use the terminal at the same time
up-d:
	docker compose up -d --build

down:
	docker compose down

clean:
	docker compose down -v --rmi all --remove-orphans

fclean: clean
	docker system prune -f -a --volumes

re: fclean all

# Show the docker logs
logs:
	docker compose logs -f

# Allow to update the schema.prisma in data base
migrate:
	docker exec -it chess_backend npx prisma migrate dev

# Updates the TypeScript of prisma code
generate:
	docker exec -it chess_backend npx prisma generate

# Open a visual data base panel ... like excel
studio:
	docker exec -it chess_backend npx prisma studio

.PHONY: all up up-d down clean fclean re logs