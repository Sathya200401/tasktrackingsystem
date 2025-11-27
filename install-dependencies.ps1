# Install dependencies for both backend and frontend
# Run from repository root in PowerShell
# Example: .\install-dependencies.ps1

$ErrorActionPreference = 'Stop'

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Push-Location "$(Split-Path -Leaf $PSScriptRoot)\backend" -ErrorAction Stop
npm install
Pop-Location

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location "$(Split-Path -Leaf $PSScriptRoot)\frontend" -ErrorAction Stop
npm install
Pop-Location

Write-Host "Done. Installed dependencies for backend and frontend." -ForegroundColor Green
