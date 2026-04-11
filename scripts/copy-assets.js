const fs = require('fs');
const path = require('path');

// Get the target app directory from command line or use current directory
const targetApp = process.argv[2] || 'web';
const isDesktop = targetApp === 'desktop-mobile';

const sourceBase = path.join(__dirname, '..', 'data');
const targetBase = isDesktop 
  ? path.join(__dirname, '..', 'apps', 'desktop-mobile', 'public')
  : path.join(__dirname, '..', 'apps', 'web', 'public');

const foldersToCopy = ['assets', 'lessons', 'levels'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️ Source directory not found: ${src}`);
    return;
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log(`📁 Created: ${dest}`);
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📋 Copied: ${path.relative(process.cwd(), srcPath)} → ${path.relative(process.cwd(), destPath)}`);
    }
  }
}

foldersToCopy.forEach(folder => {
  console.log(`🚀 Copying ${folder} from data/${folder} to apps/${targetApp}/public/${folder}...`);
  copyRecursive(path.join(sourceBase, folder), path.join(targetBase, folder));
});
console.log('✅ Assets copied successfully!');
