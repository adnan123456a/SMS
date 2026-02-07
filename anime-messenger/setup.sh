#!/bin/bash

echo "🌸 Anime Messenger Setup 🌸"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null
then
    echo "⚠️  MongoDB not found. Please install MongoDB."
    echo "   macOS: brew install mongodb-community"
    echo "   Ubuntu: See README.md for instructions"
    echo "   Windows: https://www.mongodb.com/try/download/community"
    echo ""
else
    echo "✅ MongoDB found"
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please edit .env and change SESSION_SECRET for production!"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✨ Setup complete! ✨"
    echo ""
    echo "Next steps:"
    echo "1. Make sure MongoDB is running"
    echo "2. Run: npm start"
    echo "3. Open: http://localhost:3000"
    echo ""
    echo "Have fun chatting! 🌸"
else
    echo ""
    echo "❌ Installation failed. Please check the errors above."
fi
