#!/bin/bash

# AnonScholar Development Environment Startup Script
# This script starts the complete development environment

set -e  # Exit on any error

echo "🚀 Starting AnonScholar Development Environment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "fhevm-hardhat-template" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the action/ directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0

    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done
    
    print_error "$service_name failed to start within $((max_attempts * 2)) seconds"
    return 1
}

# Function to cleanup background processes
cleanup() {
    print_status "Cleaning up background processes..."
    
    if [ ! -z "$HARDHAT_PID" ]; then
        kill $HARDHAT_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    # Kill any remaining processes on our ports
    pkill -f "hardhat node" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Set up signal handlers
trap cleanup EXIT INT TERM

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 20+"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm"
    exit 1
fi

# Check if MetaMask is available (we can't check this from command line, so just warn)
print_warning "Make sure MetaMask is installed in your browser"

print_success "Prerequisites check completed"

# Step 2: Install dependencies
print_status "Installing dependencies..."

# Install backend dependencies
if [ ! -d "fhevm-hardhat-template/node_modules" ]; then
    print_status "Installing backend dependencies..."
    cd fhevm-hardhat-template
    npm install
    cd ..
    print_success "Backend dependencies installed"
else
    print_status "Backend dependencies already installed"
fi

# Install frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
else
    print_status "Frontend dependencies already installed"
fi

# Step 3: Start Hardhat node
print_status "Starting Hardhat FHEVM node..."

# Check if Hardhat node is already running
if check_port 8545; then
    print_warning "Port 8545 is already in use. Trying to use existing Hardhat node..."
    if wait_for_service "http://localhost:8545" "Existing Hardhat node"; then
        print_success "Using existing Hardhat node"
    else
        print_error "Port 8545 is in use but not responding to RPC calls"
        print_error "Please stop the process using port 8545 and try again"
        exit 1
    fi
else
    print_status "Starting new Hardhat node..."
    cd fhevm-hardhat-template
    
    # Start Hardhat node in background
    npm run node > ../hardhat.log 2>&1 &
    HARDHAT_PID=$!
    cd ..
    
    # Wait for Hardhat node to be ready
    if wait_for_service "http://localhost:8545" "Hardhat FHEVM node"; then
        print_success "Hardhat node started successfully (PID: $HARDHAT_PID)"
    else
        print_error "Failed to start Hardhat node"
        print_error "Check hardhat.log for details"
        exit 1
    fi
fi

# Step 4: Deploy contracts
print_status "Deploying AnonScholar contracts..."

cd fhevm-hardhat-template
if npm run deploy; then
    print_success "Contracts deployed successfully"
else
    print_error "Contract deployment failed"
    exit 1
fi
cd ..

# Step 5: Generate ABI files
print_status "Generating ABI files for frontend..."

cd frontend
if npm run genabi; then
    print_success "ABI files generated successfully"
else
    print_error "ABI generation failed"
    exit 1
fi

# Step 6: Start frontend
print_status "Starting frontend development server..."

# Check if frontend port is available
if check_port 3000; then
    print_warning "Port 3000 is already in use"
    print_warning "The frontend might already be running, or another service is using port 3000"
else
    # Start frontend in background
    npm run dev:mock > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to be ready
    if wait_for_service "http://localhost:3000" "Frontend development server"; then
        print_success "Frontend started successfully (PID: $FRONTEND_PID)"
    else
        print_warning "Frontend may still be starting up"
    fi
fi

cd ..

# Step 7: Display success information
echo ""
echo "🎉 AnonScholar Development Environment is Ready!"
echo "=============================================="
echo ""
print_success "Services Status:"
echo "  🔗 Hardhat FHEVM Node:    http://localhost:8545"
echo "  🌐 Frontend Application:  http://localhost:3000"
echo ""
print_success "Next Steps:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Connect your MetaMask wallet"
echo "  3. Add localhost network to MetaMask:"
echo "     - Network Name: Localhost"
echo "     - RPC URL: http://localhost:8545"
echo "     - Chain ID: 31337"
echo "     - Currency Symbol: ETH"
echo "  4. Start asking and answering questions anonymously!"
echo ""
print_warning "Development Notes:"
echo "  - Your questions and answers are encrypted using FHEVM"
echo "  - The MockFhevmInstance is used for local development"
echo "  - Check the browser console for detailed FHEVM logs"
echo "  - Contract interactions may take a few seconds to complete"
echo ""
print_status "Log Files:"
echo "  - Hardhat Node: hardhat.log"
echo "  - Frontend: frontend.log"
echo ""
print_status "To stop the development environment, press Ctrl+C"

# Keep the script running and show live logs
echo ""
print_status "Live Logs (Ctrl+C to stop):"
echo "=============================================="

# Show live logs from both services
tail -f hardhat.log frontend.log 2>/dev/null || true


