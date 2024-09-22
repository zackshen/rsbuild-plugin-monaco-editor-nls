import { Languages } from '@/const';
import type { PluginMonacoEditorNlsOptions } from '@/types';
import { readObjectLocaleFile } from './read-file';

export default function monacoEditorLocalizedTransformLoader(code: string) {
  //@ts-ignore
  const options: PluginMonacoEditorNlsOptions = this.getOptions();
  //@ts-ignore
  const filepath = this.resourcePath;
  const localeObject = readObjectLocaleFile(
    options.locale ?? Languages.zh_hans,
  );

  if (
    /monaco-editor[\\\/]esm[\\\/]vs.+\.js/.test(filepath) &&
    !/esm[\\\/]vs[\\\/].*nls\.js/.test(filepath)
  ) {
    let _code = code;
    const re = /(?:monaco-editor[\/\\]esm[\/\\])(.+)(?=\.js)/;
    if (re.exec(filepath) && code.includes('localize(')) {
      let path = RegExp.$1;
      path = path.replaceAll('\\', '/');
      if (localeObject?.[path]) {
        _code = _code.replace(/localize\(/g, `localize("${path}", `);
        _code = _code.replace(/localize2\(/g, `localize2('${path}', `);
      }
      return _code;
    }
  }
  return code;
}
