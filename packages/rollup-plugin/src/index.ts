import { Plugin } from 'rollup';
import { type PluginConfig, createFileNameMatchers, defaultPluginConfig } from 'utils';
import { patch } from '@ts-enum-virtual-options/core';

export default function tsEnumVirtualOptions(pluginConfig?: PluginConfig): Plugin {
  pluginConfig = {
    ...defaultPluginConfig,
    ...pluginConfig,
  };
  const fileNameMatchers = createFileNameMatchers(pluginConfig);

  return {
    // 插件名称
    name: '@ts-enum-virtual-options/rollup-plugin',
    load(id) {
      if (fileNameMatchers(id)) {
        const { sourceFile } = patch(id, pluginConfig);
        return sourceFile.getFullText();
      }
      return null;
    },
  };
}
