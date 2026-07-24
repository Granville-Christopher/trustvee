const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

const root = path.join(__dirname, '..');
const src = path.join(root, 'web', 'dist');
const dest = path.join(root, 'server', 'public');

if (!fs.existsSync(path.join(src, 'index.html'))) {
  console.error('web/dist missing. Run web build first.');
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
copyDir(src, dest);
console.log(`Copied client build → server/public`);
