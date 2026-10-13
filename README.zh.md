# Temp Clipboard — temp.thpl.me

[ไทย](README.md) · [English](README.en.md) · **中文**

一个临时的粘贴板：贴下**文字 + 图片**，点「复制」就能用到任何地方。
所有数据都保存在用户自己的浏览器里（IndexedDB）——**没有服务器、没有数据库、没有账号**。

## 功能

- 发布文字 + 图片（每条最多 4 张）：输入 / Ctrl+V 粘贴 / 拖拽 / 选择文件
- 保存前自动缩小图片（最大宽度 1600px，JPEG）——省空间、复制更快
- 分开的复制按钮：文字 / 图片（Clipboard API）+ 备用下载按钮（iPhone 需要）
- 删除单条 / 全部清空 / 撤销最近删除 / 1–30 天自动删除 / 临时模式（不保存）
- 深色–浅色主题 + 3 种语言：**泰语 / 中文 / 英语**（默认跟随浏览器语言，切换后记住）
- PWA——可安装到手机 + 离线可用（Service Worker）
- 显示帖子数量和已用空间，快满时提醒

## 项目结构

| 文件 / 目录 | 用途 |
| --- | --- |
| `index.html` | 页面结构（HTML 默认泰语文案） |
| `assets/styles.css` | 全部主题/样式（颜色改 `:root` 与 `html[data-theme="dark"]`） |
| `assets/i18n.js` | 三种语言的界面文案——在这里改翻译 |
| `assets/app.js` | 逻辑：IndexedDB、图片压缩、剪贴板、删除/恢复、设置 |
| `assets/fonts/` + `assets/fonts.css` | Noto Sans Thai/Lao 字体（用 `npm run setup` 重新生成） |
| `assets/icon.svg`、`icon-192.png`、`icon-512.png` | 应用/PWA 图标 |
| `manifest.webmanifest`、`sw.js` | PWA + 离线缓存（改完文件后升级 `sw.js` 里的 `VERSION`） |
| `tools/` | 准备脚本（字体 / 图标 / 构建）+ 图标源文件 |
| `qa.html` | 本地测试页（填充示例 + 截图用）——生产环境不使用 |

> 注意：二进制文件（`.woff2` 字体、PNG 图标）不直接提交到仓库，可用脚本重新生成——见「本地运行」。

## 本地运行

需要 Node.js 18+（运行准备脚本）和现代浏览器。

```bash
npm run setup     # 下载泰语/老挝语字体 → assets/fonts/ 并解码图标
npx serve .       # 任选一种（或用 VS Code Live Server）
# 或
python -m http.server 8080
```

打开 `http://localhost:8080`——剪贴板功能在 `localhost` 或 HTTPS 下完整可用。

## 构建部署

```bash
npm run build     # → dist/（复制文件 + 拉取字体 + 解码图标）
```

`dist/` 可直接部署到任意静态托管（Cloudflare Pages / Workers 等）。

## 自定义

| 想改什么 | 去哪里 |
| --- | --- |
| 文案/翻译（3 种语言） | `assets/i18n.js` |
| 颜色、主题、间距 | `assets/styles.css` |
| 最大图片数、图片质量、缩放宽度 | `assets/app.js` 顶部常量 |
| 字体（字族/字重） | `tools/fetch-fonts.mjs` |
| 图标 | 改 `tools/icon-source.html` → 渲染 PNG 512/192 → `node tools/encode-icons.mjs` |

## 部署

- **线上地址 <https://temp.thpl.me>**——通过 **Cloudflare Pages**（项目 `temp-thpl-me-git`）在每次 push 到 `main` 时自动部署
- Cloudflare Pages 自动运行 `node tools/build.mjs`（拉字体 + 组装 `dist/`），然后由 **temp.thpl.me** 提供服务
- 手动部署：上传 `npm run build` 的产物（`dist/`）
- 用户数据永远不会到服务器——全部留在用户浏览器的 IndexedDB 里

## 隐私 / 安全

- 文本通过 `textContent` 渲染（防 XSS）；图片只以本地 Blob 保存
- 如果把链接分享出去：请勿发布个人隐私数据——每位访问者的数据只存在他们自己的设备上

## 许可证

本项目基于 **MIT 许可证**发布——可自由使用、修改、分发（保留版权声明即可）。见 [LICENSE](LICENSE)。
