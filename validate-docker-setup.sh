#!/bin/bash

# InfraSight Docker Setup Validation Script
# This script validates that all Docker files are properly configured

set -e  # Exit on any error

echo " InfraSight Docker Setup Validation"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

error_count=0
warning_count=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e " ${GREEN}Found:${NC} $1"
    else
        echo -e " ${RED}Missing:${NC} $1"
        ((error_count++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e " ${GREEN}Found:${NC} $1/"
    else
        echo -e " ${RED}Missing:${NC} $1/"
        ((error_count++))
    fi
}

# Function to validate file content
validate_content() {
    if [ -f "$1" ] && grep -q "$2" "$1"; then
        echo -e " ${GREEN}Valid:${NC} $1 contains '$2'"
    elif [ -f "$1" ]; then
        echo -e "  ${YELLOW}Warning:${NC} $1 missing '$2'"
        ((warning_count++))
    fi
}

echo ""
echo "📁 Checking Project Structure..."
echo "--------------------------------"

# Check main directories
check_dir "backend"
check_dir "frontend"

echo ""
echo " Checking Docker Files..."
echo "---------------------------"

# Check Docker files
check_file "backend/Dockerfile"
check_file "frontend/Dockerfile"
check_file "frontend/nginx.conf"
check_file "docker-compose.local.yml"
check_file "docker-compose.prod.yml"

echo ""
echo " Checking Configuration Files..."
echo "----------------------------------"

# Check configuration files
check_file "env.example"
check_file ".env"
check_file "backend/.dockerignore"
check_file "frontend/.dockerignore"

echo ""
echo " Checking Application Files..."
echo "--------------------------------"

# Check key application files
check_file "backend/main.py"
check_file "backend/requirements.txt"
check_file "frontend/package.json"
check_file "frontend/vite.config.ts"

echo ""
echo " Validating Docker Configuration..."
echo "------------------------------------"

# Validate Docker configurations
validate_content "backend/Dockerfile" "FROM python"
validate_content "backend/Dockerfile" "EXPOSE 8000"
validate_content "frontend/Dockerfile" "FROM node"
validate_content "frontend/Dockerfile" "FROM nginx"
validate_content "docker-compose.local.yml" "version:"
validate_content "docker-compose.local.yml" "services:"
validate_content "docker-compose.local.yml" "db:"
validate_content "docker-compose.local.yml" "backend:"
validate_content "docker-compose.local.yml" "frontend:"

echo ""
echo " Checking Port Configuration..."
echo "--------------------------------"

validate_content "docker-compose.local.yml" ":8000"
validate_content "docker-compose.local.yml" ":80"
validate_content "docker-compose.local.yml" ":5432"

echo ""
echo " Validation Summary"
echo "===================="

if [ $error_count -eq 0 ] && [ $warning_count -eq 0 ]; then
    echo -e "${GREEN}Success:${NC} All files are present and configured correctly."
    echo ""
    echo "Ready to deploy. You can now:"
    echo "1. Start locally: docker-compose -f docker-compose.local.yml up --build"
    echo "2. Deploy backend to Render using backend/Dockerfile"
    echo "3. Deploy frontend to Netlify"
    
elif [ $error_count -eq 0 ]; then
    echo -e "${GREEN}Success:${NC} All critical files are present."
    echo -e "${YELLOW}Warning: ${warning_count} warnings${NC} - check the items above."
    echo ""
    echo "Ready to deploy with minor warnings."
    
else
    echo -e "${RED}Error: Issues found:${NC} $error_count errors, $warning_count warnings"
    echo ""
    echo "Please fix the missing files before deploying."
    exit 1
fi

echo ""
echo " Next Steps:"
echo "1. Install Docker Desktop: https://docs.docker.com/get-docker/"
echo "2. Run: docker-compose -f docker-compose.local.yml up --build"
echo "3. Visit: http://localhost:3000 (frontend) and http://localhost:8000/docs (API)"
echo ""
