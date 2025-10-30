#!/bin/bash
echo "🔍 Running DSRT repository audit..."

# Step 1: Init npm jika belum ada
if [ ! -f package.json ]; then
  echo "📦 Initializing npm project..."
  npm init -y
fi

# Step 2: Install dependency dasar
echo "📥 Installing base dependencies..."
npm install --save-dev vite eslint rollup-plugin-terser@^7 --legacy-peer-deps

# Step 3: Generate konfigurasi minimal bila belum ada
[ ! -f vite.config.js ] && echo "export default {};" > vite.config.js && echo "🧩 Created vite.config.js"
[ ! -f .eslintrc.js ] && npx eslint --init

# Step 4: Audit repo
echo "🧠 Auditing repository structure..."
find . -type f -empty -print > empty_files.txt
if [ -s empty_files.txt ]; then
  echo "⚠️ Found empty files:"
  cat empty_files.txt
else
  echo "✅ No empty files found."
fi

# Step 5: Cek build vite
echo "⚙️ Testing vite build..."
npx vite build || echo "❌ Build failed. Check vite.config.js or dependencies."

echo "✅ DSRT audit complete!"
