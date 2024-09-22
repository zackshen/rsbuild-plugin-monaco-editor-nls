import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(function main() {
  const localesDir = path.resolve(__dirname, '../src/locales');
  const locales = fs.readdirSync(localesDir);
  const localesPath = locales.map((locale) => path.resolve(localesDir, locale));

  const distDir = path.resolve(__dirname, '../dist/locales');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  for (const localePath of localesPath) {
    const locale = path.basename(localePath);
    const distLocalePath = path.resolve(distDir, locale);
    fs.copyFileSync(localePath, distLocalePath);
  }
})();
