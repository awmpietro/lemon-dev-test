# API cmds:

up:
	@echo "Running the API..."
	docker-compose up

build_up:
	@echo "Building and running the API"
	yarn install
	docker-compose up --build

down:
	@echo "Shutdown API.."
	docker-compose down

init: build_up

	