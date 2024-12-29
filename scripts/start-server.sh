#!/usr/bin/bash

PROJECT_PATH="/solar-control-be/"

cd $PROJECT_PATH || exit

echo "Current directory: $(pwd)"

if [ ! -d "node_modules" ]; then
  echo "Installing project dependencies..."

  npm ci

  echo "Done"
fi

if [ ! -d "dist" ]; then
  echo "Building the application..."

  npm run build

  echo "Done"
fi

echo "Starting a server..."

npm run start:prod
