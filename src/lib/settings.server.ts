import fs from 'fs';
import path from 'path';

const settingsDirectory = path.join(process.cwd(), 'content', 'settings');

export function getSeoSettings() {
  const fullPath = path.join(settingsDirectory, 'seo.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getBusinessSettings() {
  const fullPath = path.join(settingsDirectory, 'business.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getGeneralSettings() {
  const fullPath = path.join(settingsDirectory, 'general.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getLinkTreeData() {
  const fullPath = path.join(settingsDirectory, 'linkTree.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getMainMenuData() {
  const fullPath = path.join(settingsDirectory, 'mainMenu.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getMainMenu() {
  return getMainMenuData();
}

export function getThemeSettings() {
  const fullPath = path.join(settingsDirectory, 'theme.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getLogosData() {
  const fullPath = path.join(settingsDirectory, 'logos.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(fileContents);
}

export function getLogos() {
  return getLogosData();
}
