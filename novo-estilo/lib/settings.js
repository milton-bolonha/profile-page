import fs from "fs";
import path from "path";

const settingsDir = path.join(process.cwd(), "content", "settings");

function readJson(fileName) {
  try {
    const filePath = path.join(settingsDir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Erro ao ler ${fileName}:`, error);
    return null;
  }
}

export function getBusinessSettings() {
  return readJson("business.json");
}

export function getGeneralSettings() {
  return readJson("general.json");
}

export function getIntegrations() {
  return readJson("integrations.json");
}

export function getLinkTreeData() {
  return readJson("linkTree.json");
}

export function getLogos() {
  return readJson("logos.json");
}

export function getMainMenu() {
  return readJson("mainMenu.json");
}

export function getThemeSettings() {
  return readJson("theme.json");
}

export function getVersionInfo() {
  return readJson("version.json");
}
