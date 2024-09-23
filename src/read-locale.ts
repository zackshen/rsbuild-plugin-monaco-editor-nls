import fs from 'node:fs';
import path from 'node:path';
import type { Languages } from '@/const';

let parsedLocaleData: Record<string, Record<string, string>> | null = null;

export function readLocalizedFile(
  locale: Languages,
): Record<string, Record<string, string>> {
  const content = readRawLocalizedFile(locale);
  if (!parsedLocaleData) {
    parsedLocaleData = JSON.parse(content) as Record<
      string,
      Record<string, string>
    >;
  }
  return parsedLocaleData;
}

export function readRawLocalizedFile(locale: Languages): string {
  const localePath = path.resolve(__dirname, 'locales', `${locale}.json`);
  if (!fs.existsSync(localePath)) {
    throw new Error(`Locale file not found: ${locale}`);
  }
  const content = fs.readFileSync(localePath, 'utf8');
  return content;
}
