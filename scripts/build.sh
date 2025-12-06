#!/bin/bash

# Build script for Al Asr Centers
set -e

echo "🚀 Starting build process..."

# Check Node version
NODE_VERSION=$(node -v)
echo "📦 Node version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --silent

# Type check
echo "🔍 Running TypeScript check..."
npm run type-check

# Lint
echo "🔧 Running linter..."
npm run lint

# Build
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📊 Build info:"
echo "   - Mode: production"
echo "   - Time: $(date)"
echo "   - Size: $(du -sh .next/standalone 2>/dev/null | cut -f1 || echo 'Unknown')"
