import * as monaco from 'monaco-editor';
import React, { useEffect, useRef } from 'react';

/**
 * 编辑器组件
 * @returns
 */
function Editor() {
  const editor_ref = useRef<HTMLDivElement>(null);

  // 编辑器的选项
  const editor_option = {
    automaticLayout: true, // 自适应布局
    scrollBeyondLastLine: false, // 取消代码后面空白
    fixedOverflowWidgets: true, // 超出编辑器大小的使用fixed属性显示
    theme: 'vs-dark',
    language: 'javascript',
    minimap: {
      enabled: false, // 不要小地图
    },
  } as monaco.editor.IEditorConstructionOptions;

  /**
   * 注册editor
   */
  const injectMonacoEditorWorker = () => {
    self.MonacoEnvironment = {
      /**
       * 动态获取worker URL
       *
       * @param _ - 占位符
       * @param label - editor类型
       * @returns
       */
      getWorker(_: string, label: string) {
        if (label === 'json') {
          //return new JsonWorker();
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/json/json.worker',
              import.meta.url,
            ),
          );
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          //return new CssWorker();
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/css/css.worker',
              import.meta.url,
            ),
          );
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          //return new HtmlWorker();
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/html/html.worker',
              import.meta.url,
            ),
          );
        }
        if (label === 'typescript' || label === 'javascript') {
          //return new TSWorker();
          return new Worker(
            new URL(
              'monaco-editor/esm/vs/language/typescript/ts.worker',
              import.meta.url,
            ),
          );
        }
        //return new EditorWorker();
        return new Worker(
          new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url),
        );
      },
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (editor_ref.current) {
      injectMonacoEditorWorker();
      const editor = monaco.editor.create(editor_ref.current, {
        value: `
const myrequire = require.config({
    // 指定一个隔离的 context，这里可以直接使用 chart.uuid
    context: chart.uuid,
    paths: {  // 配置库加载网址（注意网址没有 .js 后缀）
        echarts: '//c.58cdn.com.cn/git/cdn/echarts/4.8.0/echarts.min',
    }
});
                `,
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
