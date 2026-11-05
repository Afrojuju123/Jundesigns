import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = 'public';
const outPath = 'docs/image-inventory.md';

function getFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function run() {
  const allFiles = getFiles(publicDir);
  const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));

  console.log(`Found ${imageFiles.length} image files`);

  const results = [];

  for (const file of imageFiles) {
    const relPath = file.replace(/\\/g, '/');
    const webPath = '/' + relPath.replace(/^public\//, '');
    const stat = fs.statSync(file);
    let dimensions = 'N/A';
    let format = 'N/A';

    if (!file.endsWith('.svg')) {
      try {
        const meta = await sharp(file).metadata();
        dimensions = `${meta.width}x${meta.height}`;
        format = meta.format;
      } catch (e) {
        dimensions = 'Error reading';
      }
    } else {
      dimensions = 'Vector SVG';
      format = 'svg';
    }

    results.push({
      filePath: relPath,
      webPath,
      sizeKb: Math.round(stat.size / 1024),
      dimensions,
      format,
    });
  }

  // Print results as JSON for analysis
  console.log(JSON.stringify(results, null, 2));
}

run().catch(console.error);
