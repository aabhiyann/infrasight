#!/bin/bash

echo "🐳 Testing Docker Installation"
echo "============================="

# Test Docker
echo "1. Testing Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not installed"
    echo "Please install Docker Desktop from: https://docs.docker.com/desktop/install/mac-install/"
    exit 1
fi

echo ""
echo "2. Testing Docker Compose..."
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose is available"
    docker compose version
else
    echo "❌ Docker Compose is not available"
    exit 1
fi

echo ""
echo "3. Testing Docker daemon..."
if docker info &> /dev/null; then
    echo "✅ Docker daemon is running"
else
    echo "❌ Docker daemon is not running"
    echo "Please start Docker Desktop application"
    exit 1
fi

echo ""
echo "🎉 Docker is ready!"
echo "You can now run: docker compose -f docker-compose.local.yml up --build"
