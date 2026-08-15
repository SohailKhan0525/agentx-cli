#!/usr/bin/env bash
set -e

# AgentX Installer
# https://github.com/SohailKhan0525/agentx-cli

echo "🚀 Installing AgentX..."

if command -v bun >/dev/null 2>&1; then
  echo "Installing with Bun..."
  bun install -g @agent-qofeno/agentx-cli
elif command -v npm >/dev/null 2>&1; then
  echo "Installing with NPM..."
  npm install -g @agent-qofeno/agentx-cli
else
  echo "Error: Neither Bun nor Node/NPM found. Please install Node.js (https://nodejs.org) or Bun (https://bun.sh) first."
  exit 1
fi

echo "✨ AgentX installed successfully! Run 'agentx' to get started."
