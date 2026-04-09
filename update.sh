#!/bin/bash

# Bankfinity 32 — Easy Update Script

echo "🚀 Starting update..."

# 1. Add all changes
git add .

# 2. Commit with a message (or a default one)
if [ -z "$1" ]; then
    msg="Update routine/notices on $(date '+%Y-%m-%d %H:%M')"
else
    msg="$1"
fi

git commit -m "$msg"

# 3. Push to GitHub
echo "📤 Pushing to GitHub..."
git push

echo "✅ Done! Your site will be updated in ~30 seconds."
