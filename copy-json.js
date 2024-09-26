const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function copyJsonFiles(dir, dest) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      const srcPath = path.join(dir, file);
      const destPath = path.join(dest, file);

      if (fs.statSync(srcPath).isDirectory()) {
        // Recursively create the folder structure and copy files
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath);
        }
        copyJsonFiles(srcPath, destPath);
      } else if (file.endsWith('.json')) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  });
}

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

copyJsonFiles(srcDir, distDir);
console.log('JSON files copied successfully!');
