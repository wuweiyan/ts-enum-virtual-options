/*
 * @Author: wuweiyan@black-unique.com
 * @Date: 2024-09-04 12:25:40
 * @LastEditors: wuweiyan@black-unique.com
 * @LastEditTime: 2024-09-20 14:57:40
 * @Description:
 */
import { PluginConfig } from './type';

export const createFileNameMatchers = (options: PluginConfig = {}): ((fileName: string) => boolean) => {
  const customMatcherRegExp = new RegExp(`\\.${options.customMatcher || 'enum'}\\.ts$`);

  return (fileName: string) => customMatcherRegExp.test(fileName);
};
export const createDiagnosticsMatchers = (options: PluginConfig = {}): ((fileName: string) => string) => {
  const diagnosticsMatcher = /^Module '"([^"]+)"'\s+has no exported member '([^']+)'\.$/;

  return (messageText: string) => {
    const matcherRes = messageText.match(diagnosticsMatcher);
    if (matcherRes && (matcherRes[1]?.endsWith(`.${options.customMatcher}`) || matcherRes[1]?.endsWith(`.${options.customMatcher}.ts`))) {
      return matcherRes[2];
    }
    return '';
  };
};

export const diagnosticsRegex = /Module '\w+'\s+has\s+no\s+exported\s+member\s+'(.*?)'\./;

export const statementRegex = /#([a-zA-Z0-9][a-zA-Z0-9_]*)\(([^)]+)\)/;

export const defaultValueRegex = /\"value":"<([^<>]+)\.([^<>]+)>\"/g;

export const defaultPluginConfig: PluginConfig = { outputFormat: 'map', mapSuffix: '_Map', arraySuffix: '_List', customMatcher: 'enum' };
