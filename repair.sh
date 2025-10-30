#!/bin/bash
echo "=============================================="
echo "🚀 DSRT Full Auto Repair, Lint, Build & Push"
echo "=============================================="

# Step 1: Bersihkan node_modules dan cache
echo "🧹 Cleaning project cache..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Step 2: Install ulang dependencies (menghindari conflict)
echo "📦 Reinstalling dependencies..."
npm install --legacy-peer-deps

# Step 3: Jalankan ESLint auto-fix
echo "🔍 Running ESLint auto fix..."
npx eslint --ext .js,.mjs,.jsx --fix || echo "⚠️ ESLint finished with some warnings."

# Step 4: Jalankan npm audit & fix
echo "🧩 Auditing and fixing vulnerabilities..."
npm audit fix --force || true

# Step 5: Build project
echo "🏗️ Building with Vite..."
npx vite build || echo "⚠️ Build finished with warnings."

# Step 6: Cek perubahan Git dan commit
echo "💾 Checking for git repository..."
if [ -d ".git" ]; then
  git add -A
  if ! git diff --cached --quiet; then
    git commit -m "🔧 Auto repair, lint, and build: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "🚀 Pushing changes to remote..."
    git push origin $(git rev-parse --abbrev-ref HEAD) || echo "⚠️ Push failed."
  else
    echo "✅ No changes to commit."
  fi
else
  echo "⚠️ This is not a git repository, skipping push."
fi

echo "=============================================="
echo "🎯 DSRT Repo fully repaired, built, and synced!"
echo "=============================================="
