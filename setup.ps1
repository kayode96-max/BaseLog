# BaseLog Quick Start Script
# This script helps you set up the project quickly

Write-Host "🗓️  BaseLog Setup Script" -ForegroundColor Blue
Write-Host "========================`n" -ForegroundColor Blue

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

# Install contract dependencies
Write-Host "`nInstalling contract dependencies..." -ForegroundColor Yellow
Set-Location contracts
npm install
Set-Location ..

# Create .env files if they don't exist
if (-not (Test-Path ".env")) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and add your API keys" -ForegroundColor Red
} else {
    Write-Host "`n✓ .env file already exists" -ForegroundColor Green
}

if (-not (Test-Path "contracts\.env")) {
    Write-Host "Creating contracts/.env file..." -ForegroundColor Yellow
    Copy-Item "contracts\.env.example" "contracts\.env"
    Write-Host "✓ Created contracts/.env file" -ForegroundColor Green
    Write-Host "⚠️  Please edit contracts/.env and add your private key" -ForegroundColor Red
} else {
    Write-Host "✓ contracts/.env file already exists" -ForegroundColor Green
}

Write-Host "`n========================" -ForegroundColor Blue
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================`n" -ForegroundColor Blue

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Get API keys (see API_KEYS.md)" -ForegroundColor White
Write-Host "2. Add keys to .env file" -ForegroundColor White
Write-Host "3. Deploy contract: cd contracts && npm run deploy:base-sepolia" -ForegroundColor White
Write-Host "4. Run dev server: npm run dev" -ForegroundColor White
Write-Host "`nFor detailed instructions, see README.md" -ForegroundColor Cyan
