#!/usr/bin/bash

PROJECT_PATH="/solar-control-be"

cd $PROJECT_PATH || exit
echo "Current directory: $(pwd)"

echo "Pulling a new server version..."
git pull origin dev

echo "Installing project dependencies..."
npm ci

echo "Building the application..."
npm run build

echo "Done"
exit 0
