#!/bin/bash

# Deployment script for Al Asr Centers
set -e

ENV=${1:-production}
echo "🚀 Deploying to $ENV environment..."

# Load environment variables
if [ -f ".env.$ENV" ]; then
    echo "📄 Loading $ENV environment variables..."
    export $(cat .env.$ENV | xargs)
fi

# Build
echo "🏗️ Building application..."
./scripts/build.sh

# Deploy based on environment
case $ENV in
    production)
        echo "🌐 Deploying to production..."
        
        # Docker deployment
        if command -v docker &> /dev/null && [ -f "docker-compose.yml" ]; then
            echo "🐳 Starting Docker deployment..."
            docker-compose down
            docker-compose build --no-cache
            docker-compose up -d
            echo "✅ Docker containers started"
        fi
        
        # Vercel deployment
        if command -v vercel &> /dev/null; then
            echo "▲ Deploying to Vercel..."
            vercel --prod
        fi
        
        # PM2 deployment
        if command -v pm2 &> /dev/null && [ -f "ecosystem.config.js" ]; then
            echo "🔄 Starting PM2 deployment..."
            pm2 delete al-asr-centers 2>/dev/null || true
            pm2 start ecosystem.config.js --env production
            pm2 save
            echo "✅ PM2 process started"
        fi
        ;;
    
    staging)
        echo "🔄 Deploying to staging..."
        
        if command -v vercel &> /dev/null; then
            vercel
        fi
        ;;
    
    development)
        echo "💻 Starting development server..."
        npm run dev
        ;;
    
    *)
        echo "❌ Unknown environment: $ENV"
        exit 1
        ;;
esac

echo "🎉 Deployment completed!"
