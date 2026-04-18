COMPOSE = docker compose

all: up db-push

install: install-backend install-frontend

# Safe default:
# - rebuild images
# - refresh anonymous volumes (like /usr/src/app/node_modules)
# - keep named volumes (like postgres_data)

build-safe:
	$(COMPOSE) up -d --build --renew-anon-volumes

safe: build-safe generate db-push

sclean:
	$(COMPOSE) down
	
install-frontend:
	cd frontend && npm ci

install-backend:
	cd backend && npm ci

up:
	$(COMPOSE) up --build
	

# Builds the docker, with the option to use the terminal at the same time
up-d:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down -v --rmi all --remove-orphans

fclean: clean
	docker system prune -f -a --volumes

re: fclean all

# Show the docker logs
logs:
	$(COMPOSE) logs -f

# Allow to update the schema.prisma in data base
migrate:
	docker exec -it chess_backend npx prisma migrate dev

# Updates the TypeScript of prisma code
generate:
	docker exec -it chess_backend npx prisma generate

db-push:
	docker exec -it chess_backend npx prisma db push

# Open a visual data base panel ... like excel
studio:
	docker exec -it chess_backend npx prisma studio

.PHONY: all up up-d down clean fclean re logs