import fs from 'node:fs';
import path from 'node:path';
import { Languages } from '@/const';

let parsedLocaleData: Record<string, Record<string, string>> | null = null;

export function readRawLocaleFile(locale: Languages) {
  const localePath = path.resolve(__dirname, 'locales', `${locale}.json`);
  if (!fs.existsSync(localePath)) {
    throw new Error(`Locale file not found: ${locale}`);
  }
  const content = fs.readFileSync(localePath, 'utf8');
  return content;
}

export function readObjectLocaleFile(locale: Languages) {
  if (!parsedLocaleData) {
    const CURRENT_LOCALE_DATA = readRawLocaleFile(locale ?? Languages.zh_hans);
    parsedLocaleData = JSON.parse(CURRENT_LOCALE_DATA);
  }
  return parsedLocaleData;
}
