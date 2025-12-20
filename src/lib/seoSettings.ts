import fs from 'fs';
import path from 'path';

const settingsDirectory = path.join(process.cwd(), 'content', 'settings');

export function getSeoSettings() {
  const fullPath = path.join(settingsDirectory, 'seo.json');
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading SEO settings:', error);
    return {};
  }
}
