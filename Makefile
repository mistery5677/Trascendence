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

.PHONY: all up up-d down clean fclean re logs