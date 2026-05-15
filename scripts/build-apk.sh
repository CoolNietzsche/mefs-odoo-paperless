#!/bin/bash
echo "📦 Starting APK Build Process..."

# Check if logged in to EAS
if ! eas whoami > /dev/null 2>&1; then
  echo "🔑 Please login to your Expo account first:"
  eas login
fi

# Initialize project if needed
if [ ! -f "app.json" ]; then
  echo "❌ Error: app.json not found."
  exit 1
fi

echo "🏗️  Submitting build to EAS (Android APK)..."
eas build --platform android --profile preview --non-interactive

echo "✨ Build submitted! You can track progress at https://expo.dev"
