#!/bin/bash
# Sync system prompt from repo to local machine

REPO_PROMPT="api/system-prompt.updated.js"
LOCAL_PATH="/Users/chrispowell/Team Powell Dropbox/Chris Powell/Project Folder/Claude Code Projects/chrispowell-ai"

# Extract the system prompt value from the repo file
PROMPT=$(sed -n "/export const SYSTEM_PROMPT = \`/,/\`\.trim()/p" "$REPO_PROMPT" | sed '1d;$d' | sed 's/^`//' | sed 's/`\.trim()$//')

# Update the .env file locally
if [ -f "$LOCAL_PATH/.env" ]; then
  # Create a backup
  cp "$LOCAL_PATH/.env" "$LOCAL_PATH/.env.backup"

  # Replace the SYSTEM_PROMPT line
  # First, remove the old SYSTEM_PROMPT line if it exists
  sed -i '' '/^SYSTEM_PROMPT=/d' "$LOCAL_PATH/.env"

  # Add the new SYSTEM_PROMPT at the end
  echo "" >> "$LOCAL_PATH/.env"
  echo "# Updated: $(date)" >> "$LOCAL_PATH/.env"
  echo "SYSTEM_PROMPT='$PROMPT'" >> "$LOCAL_PATH/.env"

  echo "✓ System prompt synced to $LOCAL_PATH/.env"
  echo "✓ Backup saved to $LOCAL_PATH/.env.backup"
else
  echo "✗ Error: .env file not found at $LOCAL_PATH/.env"
  exit 1
fi
