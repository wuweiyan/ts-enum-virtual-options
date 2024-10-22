/*
 * @Author: wuweiyan@black-unique.com
 * @Date: 2024-09-04 15:42:50
 * @LastEditors: wuweiyan@black-unique.com
 * @LastEditTime: 2024-09-23 16:08:43
 * @Description:
 */
import type { TransformerExtras } from 'ts-patch';
import type { Program, TransformationContext, SourceFile } from 'typescript';
import type { PluginConfig } from 'utils';
import { createDiagnosticsMatchers, createFileNameMatchers, defaultPluginConfig } from 'utils';
import { patch } from '@ts-enum-virtual-options/core';

function transformer(program: Program, pluginConfig: PluginConfig | undefined, { diagnostics, removeDiagnostic }: TransformerExtras) {
  pluginConfig = {
    ...defaultPluginConfig,
    ...pluginConfig,
  };
  const fileNameMatchers = createFileNameMatchers(pluginConfig);
  const diagnosticsMatchers = createDiagnosticsMatchers(pluginConfig);

  return (context: TransformationContext) => {
    return (source: SourceFile) => {
      if (fileNameMatchers(source.fileName)) {
        const { sourceFile, addDeclarationNameSet } = patch(source.fileName, pluginConfig);
        const needDelDiagnosticsIndex: number[] = [];
        diagnostics.forEach((item, index) => {
          if (typeof item.messageText === 'string') {
            const target = diagnosticsMatchers(item.messageText);
            if (target && addDeclarationNameSet.has(target)) {
              needDelDiagnosticsIndex.push(index);
            }
          }
        });
        needDelDiagnosticsIndex.reverse().forEach((num) => {
          removeDiagnostic(num);
        });
        return sourceFile;
      }
      return source;
    };
  };
}

export default transformer;
