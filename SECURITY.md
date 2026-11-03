# 安全說明（SECURITY.md）

這個網站是 **純靜態網站**：只有 HTML、CSS、JavaScript 和照片，放在 GitHub Pages 上。

- 沒有後端、沒有資料庫、沒有表單、沒有登入功能。
- 不收集任何訪客資料，沒有 cookie、沒有分析或追蹤工具。
- 不載入任何第三方資源（沒有 CDN、沒有 Google Fonts、沒有外部指令碼）；字型使用系統字型。
- 瀏覽器端只會在 `localStorage` 記一個值：語言設定（`ayaka-fansite:lang` = `ja` 或 `zh`）。讀寫都包在 `try/catch` 裡，被封鎖時網站照常運作。

## 已採取的防護與用途

| 項目 | 做法 | 用途 |
| --- | --- | --- |
| Content-Security-Policy | `index.html`／`404.html` 的 `<meta http-equiv="Content-Security-Policy">`：`default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests; require-trusted-types-for 'script'` | 只允許載入同一網站的指令碼、樣式、圖片、字型與 manifest；其他來源一律封鎖。就算哪天不小心混入外部內容或注入攻擊，瀏覽器也不會執行。`base-uri 'none'` 防止被竄改相對路徑的基準，`form-action 'none'` 禁止任何表單送出，`upgrade-insecure-requests` 把 `http://` 自動升級成 `https://`。`require-trusted-types-for 'script'` 讓瀏覽器（Chromium）在執行期直接擋掉 `innerHTML`、`document.write`、`eval` 等會把字串變成 HTML／程式的操作，確保「不用 innerHTML」這條規則由瀏覽器強制執行；日後若真的需要，必須用 `trustedTypes.createPolicy()` 建立政策並在 CSP 加上 `trusted-types <名稱>`。 |
| 沒有 inline 程式與樣式 | 所有 JavaScript 與 CSS 都放在獨立檔案；HTML 裡沒有 `<script>…</script>`、`<style>`、`style="…"`、`onclick` 等屬性 | 配合上面的 CSP：inline 程式碼本來就會被封鎖，網站本身也不依賴它們 |
| 只用 `textContent`／`createElement` 寫入畫面 | `app.js` 把 `data.js` 的資料畫到畫面時不使用 `innerHTML` | 資料裡就算含有 `<`、`>` 等字元，也只會被當成文字顯示，不會變成 HTML（防 XSS） |
| Referrer 政策 | `<meta name="referrer" content="no-referrer">` | 訪客從本站點到任何地方時，不會把本站網址當作來源送出 |
| 外部連結 | 目前網站沒有外部連結；之後若新增，一律加上 `rel="noopener noreferrer"` | 防止被開啟的頁面操控本站視窗（`window.opener`）並且不送出 referrer |
| 被 iframe 嵌入時的保護 | `app.js` 檢查 `window.top !== window.self`：被嵌入時先嘗試導回最上層（同來源才會成功），然後**把整頁內容清空，只留下一段說明與「開啟網站」連結**（`target="_top"`） | GitHub Pages 無法設定 `X-Frame-Options`／`frame-ancestors` 標頭，瀏覽器也不允許跨來源 iframe 在沒有使用者互動時導向最上層，所以無法完全阻止被框；但被框的頁面會變成不可用的空殼，點擊劫持（clickjacking）與冒充就沒有內容可利用。訪客點連結即可在最上層開啟真正的網站。 |
| 照片中繼資料 | `photos/` 裡的照片已去除 EXIF（GPS、拍攝裝置等） | 不洩漏拍攝位置與裝置資訊 |
| 相對路徑 | 所有資源都用相對路徑 | 放在 `https://dc9408222000-hub.github.io/ayaka-fansite/` 這種子路徑下也能正常運作，不會意外去抓別的網址 |
| `.nojekyll` | 根目錄有 `.nojekyll` | 讓 GitHub Pages 直接發布檔案，不經過 Jekyll 處理，避免意外的轉換 |

### 已知限制

- 用 `<meta>` 設定的 CSP 不支援 `frame-ancestors` 與 `report-uri`，因此無法真正禁止被嵌入，只能在被嵌入時隱藏內容（見上表）。`404.html` 沒有 JavaScript，被嵌入時只會顯示那幾行靜態文字。
- GitHub Pages 不能自訂 HTTP 標頭（如 `Strict-Transport-Security`），請在 GitHub 的 Pages 設定勾選 **Enforce HTTPS**。

## 帳號安全建議（網站主人）

- GitHub 帳號開啟 **兩步驟驗證**（Settings → Password and authentication），並保存 recovery codes。
- **Pages 設定勾選 Enforce HTTPS**（Settings → Pages）。
- **保護 `main` 分支**（Settings → Rules → Rulesets，或 Settings → Branches）：禁止 force push 與刪除分支。
- GitHub → Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」。

## 回報問題

如果發現網站有安全或隱私上的問題，請透過這個 GitHub repo 聯絡網站主人。
