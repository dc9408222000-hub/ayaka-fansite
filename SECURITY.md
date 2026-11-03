# 安全說明（SECURITY.md）

這個網站是 **純靜態網站**：只有 HTML、CSS、JavaScript 和照片，放在 GitHub Pages 上。

- 沒有後端、沒有資料庫、沒有表單、沒有登入功能。
- 不收集任何訪客資料，沒有 cookie、沒有分析或追蹤工具。
- 不載入任何第三方資源（沒有 CDN、沒有 Google Fonts、沒有外部指令碼）；字型使用系統字型。
- 瀏覽器端只會在 `localStorage` 記一個值：語言設定（`ayaka-fansite:lang` = `ja` 或 `zh`）。讀寫都包在 `try/catch` 裡，被封鎖時網站照常運作。

## 已採取的防護與用途

| 項目 | 做法 | 用途 |
| --- | --- | --- |
| Content-Security-Policy | `index.html`／`404.html` 的 `<meta http-equiv="Content-Security-Policy">`：`default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests` | 只允許載入同一網站的指令碼、樣式、圖片、字型與 manifest；其他來源一律封鎖。就算哪天不小心混入外部內容或注入攻擊，瀏覽器也不會執行。`base-uri 'none'` 防止被竄改相對路徑的基準，`form-action 'none'` 禁止任何表單送出，`upgrade-insecure-requests` 把 `http://` 自動升級成 `https://`。 |
| 沒有 inline 程式與樣式 | 所有 JavaScript 與 CSS 都放在獨立檔案；HTML 裡沒有 `<script>…</script>`、`<style>`、`style="…"`、`onclick` 等屬性 | 配合上面的 CSP：inline 程式碼本來就會被封鎖，網站本身也不依賴它們 |
| 只用 `textContent`／`createElement` 寫入畫面 | `app.js` 把 `data.js` 的資料畫到畫面時不使用 `innerHTML` | 資料裡就算含有 `<`、`>` 等字元，也只會被當成文字顯示，不會變成 HTML（防 XSS） |
| Referrer 政策 | `<meta name="referrer" content="no-referrer">` | 訪客從本站點到任何地方時，不會把本站網址當作來源送出 |
| 外部連結 | 目前網站沒有外部連結；之後若新增，一律加上 `rel="noopener noreferrer"` | 防止被開啟的頁面操控本站視窗（`window.opener`）並且不送出 referrer |
| 防止被 iframe 嵌入 | `app.js` 一開始檢查 `window.top !== window.self`，是的話把頁面導回最上層 | GitHub Pages 無法設定 `X-Frame-Options`／`frame-ancestors` 標頭，所以用 JS 偵測，避免點擊劫持（clickjacking） |
| 照片中繼資料 | `photos/` 裡的照片已去除 EXIF（GPS、拍攝裝置等） | 不洩漏拍攝位置與裝置資訊 |
| 相對路徑 | 所有資源都用相對路徑 | 放在 `https://dc9408222000-hub.github.io/ayaka-fansite/` 這種子路徑下也能正常運作，不會意外去抓別的網址 |
| `.nojekyll` | 根目錄有 `.nojekyll` | 讓 GitHub Pages 直接發布檔案，不經過 Jekyll 處理，避免意外的轉換 |

### 已知限制

- 用 `<meta>` 設定的 CSP 不支援 `frame-ancestors` 與 `report-uri`，因此防嵌入改用 JS 偵測（見上表）。
- GitHub Pages 不能自訂 HTTP 標頭（如 `Strict-Transport-Security`），請在 GitHub 的 Pages 設定勾選 **Enforce HTTPS**。

## 帳號安全建議（網站主人）

- GitHub 帳號開啟 **兩步驟驗證**（Settings → Password and authentication），並保存 recovery codes。
- **Pages 設定勾選 Enforce HTTPS**（Settings → Pages）。
- **保護 `main` 分支**（Settings → Rules → Rulesets，或 Settings → Branches）：禁止 force push 與刪除分支。
- GitHub → Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」。

## 回報問題

如果發現網站有安全或隱私上的問題，請透過這個 GitHub repo 聯絡網站主人。
