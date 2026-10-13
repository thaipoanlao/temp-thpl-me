# Temp Clipboard — temp.thpl.me

[ไทย](README.th.md) · **English** · [中文](README.zh.md)

A temporary board for dropping **text + images**, then hitting "Copy" to paste them anywhere.
All data is stored in the user's own browser (IndexedDB) — **no server, no database, no account**.

## Features

- Post text + images (up to 4 per post): type, paste with Ctrl+V, drag & drop, or choose files
- Images auto-resized before saving (max width 1600px, JPEG) — saves space, faster copying
- Separate copy buttons: text / image (Clipboard API) + a download fallback (required on iPhone)
- Delete items / clear all / undo the latest delete / auto-delete after 1–30 days / temporary mode (no saving)
- Dark–light theme + 3 languages: **Thai / Chinese / English** (auto-detects browser language, remembers your choice)
- PWA — install it on your phone + works offline (Service Worker)
- Shows post count + storage used, warns when almost full

## Project structure

| File / folder | Purpose |
| --- | --- |
| `index.html` | Page structure (Thai text as the default in HTML) |
| `assets/styles.css` | All themes/styles (edit colors at `:root` and `html[data-theme="dark"]`) |
| `assets/i18n.js` | UI strings in all 3 languages — edit translations here |
| `assets/app.js` | Logic: IndexedDB, image compression, clipboard, delete/restore, settings |
| `assets/fonts/` + `assets/fonts.css` | Noto Sans Thai/Lao fonts (regenerate with `npm run setup`) |
| `assets/icon.svg`, `icon-192.png`, `icon-512.png` | App/PWA icons |
| `manifest.webmanifest`, `sw.js` | PWA + offline cache (bump `VERSION` in `sw.js` after edits) |
| `tools/` | File-preparation scripts (fonts / icons / build) + icon source |
| `qa.html` | Local test helper (seeds sample data + used for screenshots) — not used in production |

> Note: binary files (`.woff2` fonts, PNG icons) are not committed directly — they can be regenerated with the scripts; see "Run locally".

## Run locally

Requires Node.js 18+ (for the prep scripts) and a modern browser.

```bash
npm run setup     # download Thai/Lao fonts → assets/fonts/ and decode icons
npx serve .       # either method (or VS Code Live Server)
# or
python -m http.server 8080
```

Open `http://localhost:8080` — the clipboard works fully on `localhost` or HTTPS.

## Build for deploy

```bash
npm run build     # → dist/  (copies files + fetches fonts + decodes icons)
```

`dist/` is ready to upload to any static host (Cloudflare Pages / Workers, etc.)

## Customization

| Want to change | Go to |
| --- | --- |
| Strings/translations (3 languages) | `assets/i18n.js` |
| Colors, theme, spacing | `assets/styles.css` |
| Max images, image quality, resize width | constants at the top of `assets/app.js` |
| Fonts (family/weights) | `tools/fetch-fonts.mjs` |
| Icons | edit `tools/icon-source.html` → render PNG 512/192 → `node tools/encode-icons.mjs` |

## Deploy

- **Live at <https://temp.thpl.me>** — auto-deployed via **Cloudflare Pages** (project `temp-thpl-me-git`) on every push to `main`
- Cloudflare Pages runs `node tools/build.mjs` itself (fetch fonts + assemble `dist/`) and serves it at **temp.thpl.me**
- Manual deploys: upload the output of `npm run build` (`dist/`)
- No user data ever reaches a server — it all lives in the user's browser IndexedDB

## Privacy / Security

- Text is rendered via `textContent` (XSS-safe); images stay as local Blobs only
- Shared the link with others? Don't post personal data — each visitor's data lives only on their own device

## License

Released under the **MIT License** — free to use, modify and distribute; just keep the copyright notice. See [LICENSE](LICENSE).
