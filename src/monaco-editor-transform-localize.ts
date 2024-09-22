import fs from 'node:fs';
import path from 'node:path';
import { Languages } from '@/const';
import type { PluginMonacoEditorNlsOptions } from '@/types';

function readLocalizedFile(locale: Languages) {
  const localePath = path.resolve(__dirname, 'locales', `${locale}.json`);
  if (!fs.existsSync(localePath)) {
    throw new Error(`Locale file not found: ${locale}`);
  }
  const content = fs.readFileSync(localePath, 'utf8');
  return content;
}

let parsedLocaleData: Record<string, unknown> | null = null;

export default function monacoEditorLocalizedTransformLoader(code: string) {
  //@ts-ignore
  const options: PluginMonacoEditorNlsOptions = this.getOptions();
  if (!parsedLocaleData) {
    const CURRENT_LOCALE_DATA = readLocalizedFile(
      options.locale ?? Languages.en_gb,
    );
    parsedLocaleData = JSON.parse(CURRENT_LOCALE_DATA);
  }
  //@ts-ignore
  const filepath = this.resourcePath;

  if (
    /monaco-editor[\\\/]esm[\\\/]vs.+\.js/.test(filepath) &&
    !/esm[\\\/]vs[\\\/].*nls\.js/.test(filepath)
  ) {
    let _code = code;
    const re = /(?:monaco-editor[\/\\]esm[\/\\])(.+)(?=\.js)/;
    if (re.exec(filepath) && code.includes('localize(')) {
      let path = RegExp.$1;
      path = path.replaceAll('\\', '/');
      if (parsedLocaleData?.[path]) {
        _code = _code.replace(/localize\(/g, `localize("${path}", `);
        _code = _code.replace(/localize2\(/g, `localize2('${path}', `);
      }
      return _code;
    }
  }
  return code;
}
