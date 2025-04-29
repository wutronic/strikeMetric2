.PHONY: install start-backend start-frontend start dev clean check-python

# Check Python version
check-python:
	@python3 -c 'import sys; assert sys.version_info >= (3,8) and sys.version_info < (3,9), "Python 3.8.x is required"'

# Install dependencies
install: check-python
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Start backend server
start-backend: check-python
	@echo "Starting backend server..."
	cd backend && python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Start frontend server
start-frontend:
	@echo "Starting frontend server..."
	cd frontend && npm run dev

# Start both servers (requires tmux)
start:
	@echo "Starting both servers..."
	tmux new-session -d -s strikemetric 'make start-backend'
	tmux split-window -h 'make start-frontend'
	tmux -2 attach-session -d

# Start both servers (without tmux)
start-all:
	@echo "Starting both servers..."
	@echo "Please open two terminal windows and run:"
	@echo "  Terminal 1: make start-backend"
	@echo "  Terminal 2: make start-frontend"
	@read -p "Press enter to start backend server..."
	@make start-backend

# Development setup
dev: install start

# Clean up
clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type d -name ".pytest_cache" -exec rm -r {} +
	find . -type d -name "node_modules" -exec rm -r {} +
	find . -type f -name "*.pyc" -delete

# Help
help:
	@echo "Available commands:"
	@echo "  make install        - Install all dependencies"
	@echo "  make start-backend  - Start the backend server"
	@echo "  make start-frontend - Start the frontend server"
	@echo "  make start         - Start both servers (requires tmux)"
	@echo "  make start-all     - Start both servers (without tmux)"
	@echo "  make dev           - Setup development environment and start servers"
	@echo "  make clean         - Clean up generated files"
	@echo ""
	@echo "Requirements:"
	@echo "  - Python 3.8.x"
	@echo "  - Node.js"
	@echo "  - tmux (optional, only for 'make start')" 