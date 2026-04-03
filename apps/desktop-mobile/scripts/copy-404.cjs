// scripts/copy-404.cjs
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const targetPath = path.join(distDir, '404.html');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found. Run `npm run build` first.');
  process.exit(1);
}

try {
  fs.copyFileSync(indexPath, targetPath);
  console.log('✅ 404.html created from index.html');
} catch (err) {
  console.error('❌ Failed to copy index.html to 404.html:', err);
  process.exit(1);
}
