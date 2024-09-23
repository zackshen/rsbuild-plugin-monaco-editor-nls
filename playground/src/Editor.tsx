import * as monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';

self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new Worker(
        new URL(
          'monaco-editor/esm/vs/language/json/json.worker',
          import.meta.url,
        ),
      );
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new Worker(
        new URL(
          'monaco-editor/esm/vs/language/css/css.worker',
          import.meta.url,
        ),
      );
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new Worker(
        new URL(
          'monaco-editor/esm/vs/language/html/html.worker',
          import.meta.url,
        ),
      );
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(
        new URL(
          'monaco-editor/esm/vs/language/typescript/ts.worker',
          import.meta.url,
        ),
      );
    }
    return new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
    );
  },
};

const editor_option = {
  automaticLayout: true, // 自适应布局
  scrollBeyondLastLine: false, // 取消代码后面空白
  fixedOverflowWidgets: true, // 超出编辑器大小的使用fixed属性显示
  theme: 'vs-dark',
  language: 'json',
  minimap: {
    enabled: false, // 不要小地图
  },
} as monaco.editor.IEditorConstructionOptions;

function Editor() {
  const editor_ref = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (editor_ref.current) {
      const editor = monaco.editor.create(editor_ref.current, {
        value: `{
  "key": "value"
}`,
        ...editor_option,
      });

      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        console.log(value);
      });
    }
  }, [editor_ref.current]);

  return (
    <div
      id="monaco_editor"
      style={{ flex: 1, margin: 30, height: '600px' }}
      ref={editor_ref}
    />
  );
}

export default React.memo(Editor);
