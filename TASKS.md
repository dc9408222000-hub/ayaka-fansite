# 第二階段工作清單

BRIEF.md 的網站完成並 push 之後，依序完成以下每一項。每完成一項就 commit 並 push 到 `main`（push 前先 `git pull --rebase origin main`）。中途不用停下來詢問；遇到需要網站主人決定的事，先採用最保守的做法，並記在 README 最後的「待確認事項」。

## 1. 質感與內容完整度（最優先）

網站主人希望內容更完整、更有質感。用設計師的眼光重新檢視整個網站，邊截圖邊修改，直到每一區都經得起細看：

- 視覺：建立清楚的字級系統與留白節奏；白色系底色＋一個低彩度的主色，搭配取自「虹（彩虹）」意象的細緻點綴（漸層細線、光暈等），但不要使用任何官方 logo 或官方視覺；照片的呈現（比例、圓角、陰影、說明文字）要一致；動畫只保留一個開場的主要演出，其餘克制；深色模式要另外調色，不要只是反轉
- 首頁主視覺：照片、名字（AYAKA／彩花／あやか）、應援標語的排版要有層次，不要做成一般的模板樣式
- 內容補齊（只用確定的事實，不確定的寫「待補」，不要自己編）：
  - 年表加上兩個可以從網站主人照片確認的節點：2026-07-01 NiziU 精選輯《Portfolio》發行（活動現場海報上的資訊）、2026-08-23 網站主人參加活動並拍下相簿裡的照片
  - 相簿每張照片顯示日期與 `photos.json` 裡的說明
  - 應援留言區準備 3～5 段日中對照的範例留言（語氣溫柔、不誇張），可以輪播或並列，網站主人之後會換成自己的話
  - 新增「關於這個網站」：說明這是一位 WithU 做的非官方應援網站、照片由網站主人拍攝、請勿轉載
  - 頁尾顯示最後更新日期
- 日文文案請用自然的日文；中文用台灣慣用的繁體中文

## 2. 安全強化

- 所有 JavaScript 與 CSS 放在獨立檔案；HTML 裡不要有 inline `<script>`、`<style>`、`style="…"` 或 `onclick` 之類的屬性
- 每個 HTML 加上嚴格的 Content-Security-Policy meta：`default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests`。真的需要時才最小幅度放寬，並在 SECURITY.md 寫明原因
- 不載入任何第三方資源：不用 CDN、Google Fonts、分析或追蹤工具。字型改用系統字型堆疊；如果一定要特殊字型，自架 OFL 授權字型的子集，並附上授權檔
- 加上 `<meta name="referrer" content="no-referrer">`；所有外部連結加 `rel="noopener noreferrer"`
- 防止網站被別人用 iframe 嵌入：GitHub Pages 不能設定 X-Frame-Options，改用 JS 偵測（`window.top !== window.self`）時把頁面導回最上層
- 寫進畫面的資料一律用 `textContent`／`createElement`，不要用 `innerHTML` 插入資料
- 新增 `SECURITY.md`：說明網站是純靜態、沒有後端、沒有表單、不收集任何資料，以及上面每一項防護的用途
- 在 README 加「帳號安全建議」：GitHub 開啟兩步驟驗證、Pages 設定勾選 Enforce HTTPS、`main` 分支開啟保護（禁止 force push 與刪除）

## 3. 品質檢查

- 用 headless Chrome（例如 `npm i puppeteer`，或其他可用的方法）在 375px、768px、1280px 三種寬度截圖檢查，修正跑版、文字被截斷、出現橫向捲動等問題
- 確認日文／中文切換時，每段文字都有對應翻譯，沒有漏掉的字串
- 生日倒數用日本時間測試邊界：6/19 23:59:59、6/20 00:00:00、6/21 00:00:00。把計算邏輯抽成可測試的函式，用 node 寫測試
- 無障礙：每張圖片都有 alt、文字對比足夠、只用鍵盤也能操作（包含相簿放大檢視的焦點管理）、尊重 `prefers-reduced-motion`
- 確認所有路徑都是相對路徑，放在 `https://dc9408222000-hub.github.io/ayaka-fansite/` 這個子路徑下也能正常顯示

## 4. 載入速度與分享

- 為每張照片產生 WebP 版本（保留 JPEG 當備用），用 `<picture>`／`srcset` 依螢幕大小載入適當尺寸
- 新增 Open Graph／Twitter Card meta；分享圖從 `photos/ayaka-07.jpg` 裁一張 1200×630 的 `photos/og.jpg`，`og:image` 用絕對網址 `https://dc9408222000-hub.github.io/ayaka-fansite/photos/og.jpg`
- 新增原創 favicon（例如花朵加彩虹的簡單圖形，不要用任何官方 logo），以及 `manifest.webmanifest`
- 新增同風格的 `404.html`

## 5. 文件

- 更新 README：怎麼改文字、換照片、加年表項目、改應援留言；GitHub Pages 的開啟步驟；安全說明摘要
- 在 README 最後列出這一階段做了哪些改動，以及「待確認事項」

## 6. 最後檢查

- 全部完成後，再跑一次第 3 項的所有檢查，並重新截圖確認第 1 項的質感，確認沒有新問題再 push
