import { Languages } from '@/const';
import type { PluginMonacoEditorNlsOptions } from '@/types';
import { readLocalizedFile } from './read-locale';

export default function monacoEditorLocalizedTransformLoader(code: string) {
  //@ts-ignore
  const options: PluginMonacoEditorNlsOptions = this.getOptions();
  //@ts-ignore
  const filepath = this.resourcePath;
  const localeData = readLocalizedFile(options.locale ?? Languages.en_gb);

  if (
    /monaco-editor[\\\/]esm[\\\/]vs.+\.js/.test(filepath) &&
    !/esm[\\\/]vs[\\\/].*nls\.js/.test(filepath)
  ) {
    let transformedCode = code;
    const re = /(?:monaco-editor[\/\\]esm[\/\\])(.+)(?=\.js)/;
    if (re.exec(filepath) && code.includes('localize(')) {
      let path = RegExp.$1;
      path = path.replaceAll('\\', '/');
      if (localeData?.[path]) {
        transformedCode = transformedCode.replace(
          /localize\(/g,
          `localize("${path}", `,
        );
        transformedCode = transformedCode.replace(
          /localize2\(/g,
          `localize2('${path}', `,
        );
      }
      return transformedCode;
    }
  }
  return code;
}
