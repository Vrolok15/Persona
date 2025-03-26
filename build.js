const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run Vite build
console.log('Building project...');
execSync('npx vite build', { stdio: 'inherit' });

// Copy data directory to dist
console.log('Copying data files...');
const dataDir = path.join(__dirname, 'data');
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy each JSON file
fs.readdirSync(dataDir).forEach(file => {
    if (file.endsWith('.json')) {
        fs.copyFileSync(
            path.join(dataDir, file),
            path.join(distDir, file)
        );
    }
});

console.log('Build complete!'); 