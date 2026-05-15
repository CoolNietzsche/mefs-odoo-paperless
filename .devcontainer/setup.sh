#!/bin/bash
echo "🚀 Initializing MEFS Mobile Setup..."

# Install global dependencies
npm install -g eas-cli expo-cli

# Install project dependencies
npm install

echo "✅ Environment ready! To build your APK, run: bash scripts/build-apk.sh"
