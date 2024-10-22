import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'], // 指定入口文件
  format: ['cjs', 'esm'], // 同时生成 CJS 和 ESM 格式
  dts: true, // 生成 .d.ts 类型声明文件
  splitting: false, // 是否启用代码分割，默认是 false
  sourcemap: true,
  clean: true, // 构建前清理 dist 目录
  target: 'es2019', // 指定目标 ES 版本
  outDir: 'dist', // 输出目录
  // 可以添加更多 tsup 支持的配置项
});
