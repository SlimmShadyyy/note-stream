#!/bin/bash

echo "⚡ Starting Note Stream Setup..."

# 1. Backend Setup
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
cd ..

# 2. Dashboard Setup
echo "📦 Installing Dashboard Dependencies..."
cd dashboard
npm install
cd ..

# 3. Extension Setup
echo "📦 Installing & Building Chrome Extension..."
cd extension
npm install
npm run build
cd ..

echo "✅ All dependencies installed!"
echo ""
echo "⚠️  ACTION REQUIRED: Create a .env file in the /backend directory with your MongoDB and Gemini API keys before starting the servers."
echo "---------------------------------------------------"
echo "To start the Backend: cd backend && npm run dev"
echo "To start the Dashboard: cd dashboard && npm run dev"
echo "To load the Extension: Go to chrome://extensions and load the /extension/dist folder."
