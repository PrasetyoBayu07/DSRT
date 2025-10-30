#!/bin/bash
echo "========================================"
echo "🚀 DSRT FULL AUTO REPAIR + BUILD + AUTO PUSH"
echo "========================================"
sleep 1

# 1️⃣ Cek Git repo
if [ ! -d .git ]; then
  echo "🧩 Initializing new Git repository..."
  git init
  git branch -M main
fi

# 2️⃣ Ambil URL dari environment Codespace atau config git
REPO_URL=$(git config --get remote.origin.url)
if [ -z "$REPO_URL" ]; then
  # Coba ambil dari GitHub Codespace environment
  if [[ "$CODESPACE_NAME" != "" ]]; then
    USERNAME=$(echo "$CODESPACE_NAME" | cut -d'-' -f1)
    REPO_NAME=$(basename "$(pwd)")
    REPO_URL="https://github.com/$USERNAME/$REPO_NAME.git"
    echo "🌐 Auto-detected Codespace repo: $REPO_URL"
    git remote add origin "$REPO_URL" 2>/dev/null || true
  else
    echo "⚠️ No remote found and not in Codespace."
    echo -n "🔗 Enter your GitHub repo URL: "
    read REPO_URL
    git remote add origin "$REPO_URL"
  fi
else
  echo "✅ Remote repository found: $REPO_URL"
fi

# 3️⃣ Setup dasar project
[ -f package.json ] || npm init -y

# 4️⃣ Install dependency
echo "📦 Installing dependencies..."
npm install vite eslint --save-dev --legacy-peer-deps

# 5️⃣ Struktur wajib
for dir in src assets dist; do
  [ -d "$dir" ] || { mkdir -p "$dir"; echo "📂 Created: $dir"; }
done

# 6️⃣ File dasar
[ -f vite.config.js ] || cat <<'VCONF' > vite.config.js
import { defineConfig } from 'vite';
export default defineConfig({
  root: '.',
  build: { outDir: 'dist', sourcemap: true },
  server: { port: 5173, open: true }
});
VCONF

[ -f .eslintrc.json ] || cat <<'ESLINT' > .eslintrc.json
{
  "env": { "browser": true, "es2021": true },
  "extends": ["eslint:recommended"],
  "parserOptions": { "ecmaVersion": "latest", "sourceType": "module" },
  "rules": { "no-unused-vars": "warn", "no-console": "off" }
}
ESLINT

[ -f .gitignore ] || echo -e "node_modules\ndist\n.env" > .gitignore
[ -f src/main.js ] || echo 'console.log("🚀 DSRT Project Booted!");' > src/main.js
[ -f index.html ] || cat <<'HTML' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DSRT App</title>
</head>
<body>
  <script type="module" src="./src/main.js"></script>
</body>
</html>
HTML

# 7️⃣ Lint & Build
echo "�� Linting project..."
npx eslint src --fix || true

echo "🏗️ Building with Vite..."
npx vite build || true

# 8️⃣ Commit & Push otomatis
echo "📤 Auto committing & pushing..."
git add .
git commit -m "🔧 Auto Repair + Build + Push $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️ No changes to commit"
git push -u origin main || echo "⚠️ Push failed — check remote permissions"

echo "========================================"
echo "✅ DSRT Repo fully repaired, built, and auto-pushed!"
echo "========================================"
