# ts-enum-virtual-options
为解决项目中存在大量中、英、数值枚举的情况，不需要额外声明原枚举key对应label

## 插件配置

| 字段             | 属性    | 默认值 | 描述                                                                                                   |
|--------------------|---------|---------|:--------------------------------------------------------------------------------------------------------------|
| customMatcher      | string  | enum |默认.enum.ts结尾的文件                                                          |
| outputFormat       | string | map | 'map' \| 'array' \| 'both'` 输出格式                                                                 |
| mapSuffix  | string | _Map | map输出格式下在原枚举名称后续                                                               |
| arraySuffix  | string | _List | array输出格式下在原枚举名称后续   |

## 使用方法
### 源文件如下
```typescript
export enum Test {
  /**
   * #label(禁用)
   */
  No,
  /**
   * #label(启用)
   */
  Yes,
}
```
### 在tsc打包的项目中
```sh
npm init plugin-name
```
安装后在tsconfig.json下添加
```json

"plugins": [
      {
        "transform": "@ts-enum-virtual-options/compiler-plugin",
        "outputFormat": "both"
      }
    ]
```
运行
```bash
tsc
```
编译后产物
```javascript
export var Test;
(function (Test) {
    /**
     * #label(禁用)
     */
    Test[Test["No"] = 0] = "No";
    /**
     * #label(启用)
     */
    Test[Test["Yes"] = 1] = "Yes";
})(Test || (Test = {}));
// 模式map
export var Test_Map = (_a = {}, _a[Test.No] = { "value": Test.No, "label": "禁用" }, _a[Test.Yes] = { "value": Test.Yes, "label": "启用" }, _a);
// 模式array
export var Test_List = [
    { "value": Test.No, "label": "禁用" },
    { "value": Test.Yes, "label": "启用" }
];
```
### 在vite\rollup打包的项目中
安装后在vite.config.ts\rollup.config.js下添加
```javascript
plugins: [
    tsEnumVirtualOptions()
    ]
```
