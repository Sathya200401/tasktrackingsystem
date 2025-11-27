#!/usr/bin/env bash
set -euo pipefail

echo "Installing backend dependencies..."
(cd backend && npm install)

echo "Installing frontend dependencies..."
(cd frontend && npm install)

echo "All dependencies installed for backend and frontend." > /dev/stderr

echo "Done."