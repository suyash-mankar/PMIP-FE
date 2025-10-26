#!/bin/bash
# Google Analytics 4 Environment Setup Script

echo "Setting up Google Analytics 4 environment variable..."
echo "VITE_GA_MEASUREMENT_ID=G-5NMT889SK2" > .env.local
echo "✅ Created .env.local with GA4 Measurement ID"
echo ""
echo "To verify, run: cat .env.local"
