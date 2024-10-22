import { Project, VariableDeclarationKind } from 'ts-morph';
import { JSDoc, type SourceFile } from 'typescript';
import { defaultValueRegex, statementRegex, type PluginConfig } from 'utils';

export const patch = (fileName: string, pluginConfig: PluginConfig): { sourceFile: SourceFile; addDeclarationNameSet: Set<string> } => {
  const project = new Project();
  project.addSourceFilesFromTsConfig('./tsconfig.json');
  const sourceFile = project.addSourceFileAtPath(fileName);
  const existedDeclarationNameSet: Set<string> = new Set(
    ...[...sourceFile.getEnums(), ...sourceFile.getClasses(), ...sourceFile.getFunctions(), ...sourceFile.getVariableDeclarations()].map((item) =>
      item.getName(),
    ),
  );
  const addDeclarationNameSet: Set<string> = new Set();
  sourceFile.getEnums().forEach((enumDeclaration) => {
    const statement = enumDeclaration.compilerNode;
    const mapCache: Record<string, Record<string, string>> = {};
    statement.members.forEach((member) => {
      // @ts-ignore
      const jsDoc = (member.jsDoc || []) as JSDoc[];
      const item: Record<string, string> = {};
      jsDoc.forEach((jsDocItem) => {
        if (!jsDocItem.comment || Array.isArray(jsDocItem.comment)) return;
        const tags = (jsDocItem.comment as string).split('\n');
        tags.forEach((tagItem) => {
          const arr = tagItem.match(statementRegex);
          if (arr && arr.length === 3) {
            item[arr[1]] = arr[2];
          }
        });
      });
      if (Object.keys(item).length) {
        mapCache[`${statement.name.escapedText}.${member.name.getText()}`] = item.value
          ? item
          : {
              value: `<${statement.name.escapedText}.${member.name.getText()}>`,
              ...item,
            };
      }
    });
    if (Object.keys(mapCache).length) {
      if (
        (pluginConfig?.outputFormat === 'map' || pluginConfig?.outputFormat === 'both') &&
        !existedDeclarationNameSet.has(`${statement.name.escapedText}${pluginConfig.mapSuffix}`)
      ) {
        sourceFile.addVariableStatement({
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${statement.name.escapedText}${pluginConfig.mapSuffix}`,
              initializer: `{${Object.entries(mapCache)
                .map(([key, value]) => {
                  return `[${key}]: ${JSON.stringify(value).replace(defaultValueRegex, '"value": $1.$2 ')}`;
                })
                .join(',\n')}}`,
            },
          ],
        });
        addDeclarationNameSet.add(`${statement.name.escapedText}${pluginConfig.mapSuffix}`);
      }
      if (
        (pluginConfig?.outputFormat === 'array' || pluginConfig?.outputFormat === 'both') &&
        !existedDeclarationNameSet.has(`${statement.name.escapedText}${pluginConfig.arraySuffix}`)
      ) {
        sourceFile.addVariableStatement({
          isExported: true,
          declarationKind: VariableDeclarationKind.Const,
          declarations: [
            {
              name: `${statement.name.escapedText}${pluginConfig.arraySuffix}`,
              initializer: `[\n${Object.entries(mapCache)
                .map(([key, value]) => {
                  return `${JSON.stringify(value).replace(defaultValueRegex, '"value": $1.$2 ')}`;
                })
                .join(',\n')}\n]`,
            },
          ],
        });
        addDeclarationNameSet.add(`${statement.name.escapedText}${pluginConfig.arraySuffix}`);
      }
    }
  });
  return { sourceFile: sourceFile.compilerNode, addDeclarationNameSet };
};
