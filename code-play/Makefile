UV_CHECK := $(shell command -v uv 2>/dev/null)
NODE_VERSION := $(shell node -v 2>/dev/null | sed 's/v//')
PNPM_CHECK := $(shell command -v pnpm 2>/dev/null)

install:
	@echo "You're about to install CodePlay.\n"
	@echo "Please make sure you have the following dependencies installed:"
	@echo "1. Node.js 22 or higher"
	@echo "2. pnpm"
	@echo "3. uv"
	@echo "If you don't have these dependencies, please install them first."
	@echo "\n\n===============================================================\n"
	@echo "Checking environment..."
	@$(MAKE) check_uv
	@$(MAKE) check_node
	@$(MAKE) check_pnpm
	@echo "\nInstalling backend dependencies..."
	@cd backend && uv sync
	@echo "\nInstalling frontend dependencies..."
	@cd frontend && pnpm install
	@echo "\n===============================================================\n\n"
	@echo "Congratulations! CodePlay is now installed successfully.\n"
	@echo "> Run 'make dev' to start the development server.\n"

check_uv:
	@if [ -z "$(UV_CHECK)" ]; then \
		echo "Error: uv is not installed. Please visit https://uvtool.io/ to download and install uv.\n\nUV is a modern package manager for Python."; \
		exit 1; \
	else \
		echo "uv is installed."; \
	fi

check_node:
	@if [ -z "$(NODE_VERSION)" ]; then \
		echo "Error: Node.js is not installed. Please visit https://nodejs.org/ to download and install Node.js 22 or higher."; \
		exit 1; \
	elif [ $(NODE_VERSION) -lt 22 ]; then \
		echo "Error: Current Node.js version is $(NODE_VERSION). Please upgrade to Node.js 22 or higher."; \
		exit 1; \
	else \
		echo "Node.js version is $(NODE_VERSION)."; \
	fi

check_pnpm:
	@if [ -z "$(PNPM_CHECK)" ]; then \
		echo "Error: pnpm is not installed. Please visit https://pnpm.io/ to download and install pnpm.\n\nPNPM is a fast, disk space efficient package manager for Node.js."; \
		exit 1; \
	else \
		echo "pnpm is installed."; \
	fi

dev:
	@echo "Starting development servers for backend and frontend...\n"
	@$(MAKE) dev_backend &
	@$(MAKE) dev_frontend &
	@wait

dev_backend:
	@echo "Starting backend development server..."
	@cd backend && uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.12 langgraph dev --allow-blocking

dev_frontend:
	@echo "Starting frontend development server..."
	@cd frontend && pnpm dev
