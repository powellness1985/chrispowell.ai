#!/bin/bash
# sync-system-prompt.sh
# Reads api/system-prompt.js, encodes it as base64, writes to .env,
# and optionally pushes to Vercel production via CLI.
#
# Usage:
#   ./sync-system-prompt.sh           # update .env only
#   ./sync-system-prompt.sh --vercel  # update .env AND push to Vercel

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROMPT_FILE="$SCRIPT_DIR/api/system-prompt.js"
ENV_FILE="$SCRIPT_DIR/.env"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "✗ Error: $PROMPT_FILE not found (it is gitignored — create it from system-prompt.example.js)"
  exit 1
fi

echo "→ Encoding system prompt..."
ENCODED=$(node -e "
  import('$PROMPT_FILE').then(m => {
    process.stdout.write(Buffer.from(m.SYSTEM_PROMPT).toString('base64'));
  }).catch(e => { console.error(e); process.exit(1); });
")

# Backup existing .env
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "$ENV_FILE.backup"
  echo "→ Backed up existing .env to .env.backup"
fi

# Write new .env (preserve other vars, replace SYSTEM_PROMPT)
if [ -f "$ENV_FILE" ]; then
  sed -i '' '/^SYSTEM_PROMPT=/d' "$ENV_FILE"
  echo "SYSTEM_PROMPT=$ENCODED" >> "$ENV_FILE"
else
  echo "SYSTEM_PROMPT=$ENCODED" > "$ENV_FILE"
fi
echo "✓ .env updated with new system prompt ($(echo "$ENCODED" | wc -c | tr -d ' ') chars base64)"

# Also write plain text for easy Vercel dashboard paste
node -e "
  import('$PROMPT_FILE').then(m => {
    require('fs').writeFileSync('$SCRIPT_DIR/SYSTEM_PROMPT_FOR_VERCEL.txt', m.SYSTEM_PROMPT);
    console.log('✓ SYSTEM_PROMPT_FOR_VERCEL.txt written — paste this into Vercel dashboard');
  });
"

# Optionally push to Vercel
if [ "$1" = "--vercel" ]; then
  if ! command -v vercel &>/dev/null; then
    echo "✗ Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
  fi
  echo "→ Pushing to Vercel (production, preview, development)..."
  echo "$ENCODED" | vercel env add SYSTEM_PROMPT production --force
  echo "$ENCODED" | vercel env add SYSTEM_PROMPT preview --force
  echo "✓ Vercel env var updated. Redeploy to pick it up:"
  echo "  vercel --prod"
fi

echo ""
echo "Done. To push to Vercel manually:"
echo "  1. Open SYSTEM_PROMPT_FOR_VERCEL.txt"
echo "  2. Copy all contents"
echo "  3. Vercel dashboard → Settings → Environment Variables → SYSTEM_PROMPT → paste"
echo "  4. Save and redeploy"
