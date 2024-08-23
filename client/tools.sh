#!/bin/bash

# BUILD PREPARATION PROCESS

# stop this script at first error
set -e

# remove old build artifacts
rm -rf dist/*

# transpile typescript
tsc

# Ensure the destination directories exist
mkdir -p dist/src
mkdir -p dist/src/editors/default
mkdir -p dist/src/resources

# copy robot-python
cp ./src/editors/default/*.py ./dist/src/editors/default || echo "No Python scripts found."

# copy icons
cp -r icons ./dist/src/ || echo "No icons directory found."

# copy vscode extension from vscode extension folder
rm -rf ./src/resources/*

# Debugging line: Print the path we're checking for .vsix
echo "Checking for .vsix in ../spoken-vscode-driver/"

# Attempt to copy .vsix file
vsix_path=$(find ../spoken-vscode-driver/ -name "*.vsix" -print -quit)
if [ -z "$vsix_path" ]; then
    echo ".vsix file not found, aborting."
    exit 1
else
    echo "Found .vsix file at: $vsix_path"
    cp "$vsix_path" ./src/resources || echo "Failed to copy .vsix file."
fi

# copy extension file to resources folder
cp -r ./src/resources/** ./dist/src/resources || echo "No resources found to copy."

# copy HTML files
cp ./src/*.html ./dist/src || echo "No HTML files found."

# build spoken (uncomment if needed)
# cd ../spoken && npm run build && cd ../client

# fixing environment
if [ -z $1 ]; then 
    ENV='dev'
else
    ENV=$1
fi

cp -r ./src/.env* ./dist/src/ || echo "No .env files found."

if [ $ENV = "prod" ]; then
    if test -f dist/.env.prod; then # check if the file .env.prod exists
        rm -rf dist/.env
        mv dist/.env.prod dist/.env
    fi
fi

echo "Ready to build."