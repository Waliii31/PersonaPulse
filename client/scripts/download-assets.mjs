import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public/images');

// Helper to download an image
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const avatars = [
  { name: 'maya.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=85' },
  { name: 'darius.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85' },
  { name: 'sandra.jpg', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=85' },
  { name: 'norbi.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85' },
  { name: 'jani.jpg', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85' }
];

async function main() {
  console.log('Downloading avatars...');
  for (const avatar of avatars) {
    const dest = path.join(publicDir, 'avatars', avatar.name);
    console.log(`Downloading ${avatar.name}...`);
    try {
      await downloadFile(avatar.url, dest);
      console.log(`✓ Saved ${avatar.name}`);
    } catch (err) {
      console.error(`Error downloading ${avatar.name}:`, err.message);
    }
  }
}

main();
