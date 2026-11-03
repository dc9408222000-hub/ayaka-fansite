# 第二階段工作清單

BRIEF.md 的網站完成並 push 之後，依序完成以下每一項。每完成一項就 commit 並 push 到 `main`（push 前先 `git pull --rebase origin main`）。中途不用停下來詢問；遇到需要網站主人決定的事，先採用最保守的做法，並記在 README 最後的「待確認事項」。

## 1. 安全強化

- 所有 JavaScript 與 CSS 放在獨立檔案；HTML 裡不要有 inline `<script>`、`<style>`、`style="…"` 或 `onclick` 之類的屬性
- 每個 HTML 加上嚴格的 Content-Security-Policy meta：`default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests`。真的需要時才最小幅度放寬，並在 SECURITY.md 寫明原因
- 不載入任何第三方資源：不用 CDN、Google Fonts、分析或追蹤工具。字型改用系統字型堆疊；如果一定要特殊字型，自架 OFL 授權字型的子集，並附上授權檔
- 加上 `<meta name="referrer" content="no-referrer">`；所有外部連結加 `rel="noopener noreferrer"`
- 防止網站被別人用 iframe 嵌入：GitHub Pages 不能設定 X-Frame-Options，改用 JS 偵測（`window.top !== window.self`）時把頁面導回最上層
- 寫進畫面的資料一律用 `textContent`／`createElement`，不要用 `innerHTML` 插入資料
- 新增 `SECURITY.md`：說明網站是純靜態、沒有後端、沒有表單、不收集任何資料，以及上面每一項防護的用途
- 在 README 加「帳號安全建議」：GitHub 開啟兩步驟驗證、Pages 設定勾選 Enforce HTTPS、`main` 分支開啟保護（禁止 force push 與刪除）

## 2. 品質檢查

- 用 headless Chrome（例如 `npm i puppeteer`，或其他可用的方法）在 375px、768px、1280px 三種寬度截圖檢查，修正跑版、文字被截斷、出現橫向捲動等問題
- 確認日文／中文切換時，每段文字都有對應翻譯，沒有漏掉的字串
- 生日倒數用日本時間測試邊界：6/19 23:59:59、6/20 00:00:00、6/21 00:00:00。把計算邏輯抽成可測試的函式，用 node 寫測試
- 無障礙：每張圖片都有 alt、文字對比足夠、只用鍵盤也能操作（包含相簿放大檢視的焦點管理）、尊重 `prefers-reduced-motion`
- 確認所有路徑都是相對路徑，放在 `https://dc9408222000-hub.github.io/ayaka-fansite/` 這個子路徑下也能正常顯示

## 3. 載入速度與分享

- 為每張照片產生 WebP 版本（保留 JPEG 當備用），用 `<picture>`／`srcset` 依螢幕大小載入適當尺寸
- 新增 Open Graph／Twitter Card meta；分享圖從 `photos/ayaka-07.jpg` 裁一張 1200×630 的 `photos/og.jpg`，`og:image` 用絕對網址 `https://dc9408222000-hub.github.io/ayaka-fansite/photos/og.jpg`
- 新增原創 favicon（例如花朵加彩虹的簡單圖形，不要用任何官方 logo），以及 `manifest.webmanifest`
- 新增同風格的 `404.html`

## 4. 文件

- 更新 README：怎麼改文字、換照片、加年表項目、改應援留言；GitHub Pages 的開啟步驟；安全說明摘要
- 在 README 最後列出這一階段做了哪些改動，以及「待確認事項」

## 5. 最後檢查

- 全部完成後，再跑一次第 2 項的所有檢查，確認沒有新問題再 push
