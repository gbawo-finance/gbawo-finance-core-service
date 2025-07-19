#!/bin/bash

# Gbawo Finance Development Database Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[DEV-DB]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Check if .env file exists
check_env() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_status "Created .env file from .env.example"
        else
            print_error ".env.example not found. Please create .env file manually."
            exit 1
        fi
    fi
}

# Start the database
start_db() {
    print_info "Starting PostgreSQL database..."
    check_docker
    check_env
    
    docker-compose up -d postgres
    
    print_info "Waiting for database to be ready..."
    sleep 5
    
    # Wait for health check to pass
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; then
            print_status "✅ Database is ready!"
            print_info "📊 PostgreSQL is running on localhost:5432"
            print_info "🗄️  Database: gbawo_finance"
            print_info "👤 Username: postgres"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Database failed to start after ${max_attempts} attempts"
            exit 1
        fi
        
        print_info "Attempt $attempt/$max_attempts - waiting for database..."
        sleep 2
        ((attempt++))
    done
}

# Stop the database
stop_db() {
    print_info "Stopping PostgreSQL database..."
    docker-compose down postgres
    print_status "✅ Database stopped"
}

# Start database with Adminer
start_full() {
    print_info "Starting PostgreSQL database with Adminer..."
    check_docker
    check_env
    
    docker-compose up -d
    
    print_info "Waiting for services to be ready..."
    sleep 8
    
    print_status "✅ Services are ready!"
    print_info "📊 PostgreSQL is running on localhost:5432"
    print_info "🌐 Adminer (DB Admin) is running on http://localhost:8080"
    print_info "🗄️  Database: gbawo_finance"
    print_info "👤 Username: postgres"
}

# Stop all services
stop_all() {
    print_info "Stopping all services..."
    docker-compose down
    print_status "✅ All services stopped"
}

# View logs
logs() {
    print_info "Showing database logs..."
    docker-compose logs -f postgres
}

# Reset database (remove volumes)
reset_db() {
    print_warning "This will DELETE ALL DATA in the database!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Stopping services and removing volumes..."
        docker-compose down -v
        print_status "✅ Database reset completed"
    else
        print_info "Reset cancelled"
    fi
}

# Show status
status() {
    print_info "Services status:"
    docker-compose ps
}

# Show help
show_help() {
    echo -e "${BLUE}Gbawo Finance Development Database Management${NC}"
    echo ""
    echo "Usage: ./scripts/dev-db.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start      Start PostgreSQL database only"
    echo "  stop       Stop PostgreSQL database only"
    echo "  full       Start PostgreSQL + Adminer (web UI)"
    echo "  down       Stop all services"
    echo "  logs       Show database logs"
    echo "  status     Show services status"
    echo "  reset      Reset database (DELETE ALL DATA)"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/dev-db.sh start     # Start database"
    echo "  ./scripts/dev-db.sh full      # Start with web UI"
    echo "  ./scripts/dev-db.sh logs      # View logs"
}

# Main script logic
case "${1:-help}" in
    "start")
        start_db
        ;;
    "stop")
        stop_db
        ;;
    "full")
        start_full
        ;;
    "down")
        stop_all
        ;;
    "logs")
        logs
        ;;
    "status")
        status
        ;;
    "reset")
        reset_db
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac 