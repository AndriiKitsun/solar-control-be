#!/usr/bin/bash

PROJECT_PATH="."

cd $PROJECT_PATH || exit
echo "Current directory: $(pwd)"

echo "Fetching new tags from remote..."
git fetch --tags

latestTag=$(git describe --tags "$(git rev-list --tags --max-count=1)")

echo "Checking out latest tag: $latestTag"
git checkout "${latestTag}"

echo "Installing project dependencies..."
npm ci

echo "Building the application..."
npm run build

echo "Done"
