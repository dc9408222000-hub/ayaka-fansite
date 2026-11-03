# 安全稽核報告（security-audit.md）

- 稽核對象：`origin/main`（目前 commit `3ea44ac`；程式碼與 `c203b68` 相同，`3ea44ac` 只改了 README）
- 本報告所在分支：`review-security`。稽核員只讀 `main`，不修改、不 push `main`
- 稽核起始：2026-11-04 06:21（台灣時間）；持續到 10:45
- 最後更新：2026-11-04 07:22（台灣時間）
- 編號規則：S-01、S-02…，編號固定不重複使用；狀態為「未處理／已修正／不適用」
- 方法：每次 `main` 有新 commit 就把快照匯出到乾淨目錄，跑靜態檢查（grep、本地規則的 semgrep、eslint + no-unsanitized/security 外掛）、圖片中繼資料檢查（Pillow／exifread／JPEG 區段解析，exiftool 在此環境裝不到）、Playwright 實際載入（console 的 CSP 違規、所有請求主機、跨來源 iframe 嵌入測試、URL／hash／localStorage 的 XSS 探針），再由人工逐行讀原始碼確認；另外用多個獨立視角重複找問題並互相反駁，只保留能用證據支持的項目

## 總結（07:22 版；之後若狀態有變會更新，最後一次 push 的版本為準）

- 稽核對象：`origin/main` @ `3ea44ac`（程式碼與 `c203b68` 相同）。完整稽核了 `index.html`、`404.html`、`app.js`、`countdown.js`、`data.js`、`styles.css`、`manifest.webmanifest`、`favicon.svg`、41 個圖片檔、`scripts/`、`test/`、`package.json`、`.gitignore`、README／SECURITY.md，以及 git 歷史與 GitHub 設定。
- 注意：雲端 session 額度預計 08:15 用完，開發 session 可能來不及處理下面的未處理項目；每一項都已寫好可以直接照做的修法，網站主人之後自己做即可。

| 嚴重度 | 未處理 | 已修正 | 不適用 |
|---|---|---|---|
| 高 | 0 | 0 | 0 |
| 中 | 1（S-02） | 1（S-04） | 0 |
| 低 | 3（S-01、S-03、S-05） | 0 | 0 |

**整體風險評估：低～中。** 訪客面沒有可利用的漏洞：沒有 XSS 途徑（所有寫入都用 `textContent`，URL／hash／localStorage 的 payload 實測都進不了 DOM）、不載入任何第三方資源、兩個頁面都有以 `default-src 'none'` 為基準的 CSP、沒有 inline 程式、所有圖片都沒有 EXIF／GPS、repo 沒有任何機密。剩下的是：S-02（中）防止 iframe 嵌入的 JS 在跨來源 iframe 內實測無效，等於沒有點擊劫持防護，但本站沒有可被劫持的操作，主要風險是被整頁框進別人的網站；S-01／S-03／S-05 都是低嚴重度的帳號隱私、供應鏈與縱深防禦項目。

**建議處理順序**：S-02（改成「被嵌入時隱藏內容＋提供 `target="_top"` 連結」，並修正 SECURITY.md／README 的描述）→ S-05（CSP 加 `require-trusted-types-for 'script'`，一行）→ S-03（commit lockfile）→ S-01（網站主人到 GitHub 設定 email 隱私，改寫歷史與否自行決定）→「建議設定」的分支保護、2FA、Enforce HTTPS。

### 無法靠靜態網站完全解決的項目：限制內最好的做法與取捨

| 想要的防護 | GitHub Pages 的限制 | 限制內最好的做法 | 取捨／殘餘風險 |
|---|---|---|---|
| 防止被 iframe 嵌入（`X-Frame-Options`、CSP `frame-ancestors`） | 不能設定 HTTP 標頭；`<meta>` 版 CSP 會忽略 `frame-ancestors` | JS 偵測 `window.top !== window.self` 時**清空頁面、只留一段說明與 `target="_top"` 的連結**，`top.location.replace()` 只當附帶嘗試（S-02 有完整程式碼） | 無法阻止「被框」這件事，只能讓被框的頁面無用。攻擊者用 `sandbox` 關掉 JS 時防護不會執行，但本站內容全由 JS 畫出，對方也只會得到主視覺照片與空殼。Chromium 不允許沒有使用者互動的跨來源 top 導向，所以不能只靠導向 |
| 強制 HTTPS（`Strict-Transport-Security`） | 不能設定標頭、`*.github.io` 子網域無法自行 preload | Pages 設定勾 **Enforce HTTPS**（`http://` 會 301 到 `https://`）；CSP 已有 `upgrade-insecure-requests`；對外分享一律用 `https://` 網址（og:url／canonical 已是） | 訪客第一次手動輸入 `http://` 的那一次連線仍可能被攔截；github.io 是否在瀏覽器 HSTS preload 清單，此環境連不到 github.io 無法驗證，開站後可用 `curl -sI https://dc9408222000-hub.github.io/ayaka-fansite/` 查看實際標頭 |
| CSP 違規回報（`report-uri`／`report-to`） | `<meta>` 不支援 | 本機用 `scripts/qa.js` 監聽 `securitypolicyviolation` 事件（已經有做），每次改完程式跑一次 | 線上發生的違規不會有通知；靠測試與審查 |
| `X-Content-Type-Options`、`Permissions-Policy`、COOP／CORP 等標頭 | 不能設定 | 本站沒有使用者上傳內容、沒有用到相機／麥克風／定位等 API、沒有跨來源視窗互動，這些標頭的保護對象不存在，不需要替代方案 | 無實質殘餘風險；Pages 本身會送哪些標頭，開站後用 `curl -I` 確認即可 |
| 防止程式碼誤用 `innerHTML`（Trusted Types） | 無限制 | CSP 加 `require-trusted-types-for 'script'`（S-05，已實測不影響功能） | 只在 Chromium 系瀏覽器生效，Firefox／Safari 會忽略；屬縱深防禦 |
| 第三方資源完整性（SRI） | 無限制 | 目前沒有任何外部資源，所以不需要；以後若要特殊字型，自架 OFL 字型子集並附授權，不要用 CDN；真的要用外部 script 時加 `integrity` 並把來源加進 CSP | — |
| 帳號與 repo 層（2FA、分支保護、secret scanning、email 隱私） | 不是網站能解決的 | 見「建議設定」一節與 S-01 | 分支保護目前（07:22）仍未啟用 |
| 沒有後端所以無法做的事（登入、留言表單、分析） | — | 本站刻意不做；`form-action 'none'`、`connect-src` 落在 `default-src 'none'` 都已封死 | 若之後想加留言功能，必須引入第三方服務，屆時要重新評估 CSP 與隱私 |

## 問題清單

### S-01　commit 歷史中含有網站主人的個人 Gmail 地址

- 嚴重度：低
- 位置：git 歷史，commit `fa239a6`「Initial commit」的 author email（不在任何檔案裡；其餘 commit 都是 noreply 地址）
- 說明與影響：repo 是公開的，任何人用 `git log`、GitHub 的 `https://github.com/dc9408222000-hub/ayaka-fansite/commit/fa239a6.patch` 或 GitHub API 都能取得作者 email。初始 commit 用的是網站主人的個人 Gmail，而不是 GitHub 提供的 `noreply` 地址。影響：信箱會被爬蟲收集，增加垃圾信與釣魚信（例如假冒 GitHub 的登入通知）的風險；也是把 GitHub 帳號與個人信箱連在一起的線索。因為信箱帳號名稱與 GitHub 使用者名稱相同、額外洩漏的身分資訊有限，所以評為低。
- 具體建議修法：
  1. GitHub → Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」。之後在 GitHub 網頁上做的 commit 會自動改用 `252630514+dc9408222000-hub@users.noreply.github.com`
  2. 本機若會 commit：`git config --global user.email "252630514+dc9408222000-hub@users.noreply.github.com"`
  3. 既有的 `fa239a6` 只能靠改寫歷史（`git filter-repo --mailmap` 或 GitHub 文件「Changing author info」的流程）清掉。這會改變之後所有 commit 的 SHA、需要 force push，會和正在開發的 session 衝突，建議等開發與稽核都結束後，由網站主人自行決定是否要做。如果決定保留歷史不改，請把本項狀態改為「不適用」並註明。
- 狀態：未處理（需由網站主人處理；開發 session 不應為此 force push `main`。README 的「待確認事項」已於 `3ea44ac` 列入此項，作法正確）

### S-02　防止 iframe 嵌入的 JS 在跨來源 iframe 內無效，網站仍可被完整嵌入（點擊劫持防護沒有達成）

- 嚴重度：中
- 位置：`app.js:10-13`（`if (window.top !== window.self) { window.top.location.href = window.location.href; }` 包在 try/catch 裡）；`SECURITY.md:19`、`SECURITY.md:26`、`README.md:28`、`README.md:151`、`README.md:165`（說明與實際行為不符）；`404.html`（沒有載入任何 script，完全沒有防護，但該頁只有靜態文字）
- 說明與影響：`cb1cb13` 時完全沒有嵌入防護；`c203b68` 加了上述 JS。但攻擊者嵌入本站時一定是**跨來源** iframe，而 Chromium 會拒絕沒有使用者互動（user activation）的跨來源 top-level 導向。實測（Chromium 153，把 `index.html` 放進另一個 port 的頁面的 `<iframe>`）：console 出現「Unsafe attempt to initiate navigation … The frame attempting navigation is targeting its top-level window, but is neither same-origin with its target nor has it received a user gesture」，丟出的 SecurityError 被 `catch (e) {}` 吞掉，頁面在 iframe 裡照常完整顯示（內文 1483 字、11 張圖片都在，可操作）。`sandbox="allow-scripts allow-same-origin"` 的 iframe 結果相同；`sandbox` 不給 allow-scripts 時 JS 完全不執行，但本站所有內容都由 JS 畫出，所以只會看到主視覺照片與空殼。同一個實驗若先在 iframe 內點一下再導向就會成功，證明差別只在 user activation。結論：目前的防護等於沒有，而 SECURITY.md／README 卻寫成已經防住，會給網站主人錯誤的安全感。實際影響：網站沒有表單、登入或任何會改變狀態的操作，點擊劫持能騙到的只有語言切換和開相簿；比較實際的風險是整站被別人的網頁框進去冒充、蓋廣告或釣魚。因此評為中而非高。
- 具體建議修法：
  1. 偵測到被嵌入時，**先把內容藏起來、不要只靠導向**。因為 `app.js` 放在 `</body>` 前，執行時 DOM 已存在，可以在 IIFE 最前面這樣做（全部用 `createElement`／`textContent`，符合 CSP）：
     ```js
     if (window.top !== window.self) {
       try { window.top.location.replace(window.location.href); } catch (e) { /* 跨來源且沒有 user activation 時會失敗 */ }
       var body = document.body;
       while (body.firstChild) { body.removeChild(body.firstChild); }
       var p = document.createElement('p');
       p.textContent = 'このページは別のサイトに埋め込まれています。／本頁被嵌入在其他網站中。';
       var a = document.createElement('a');
       a.href = window.location.href; a.target = '_top'; a.rel = 'noopener';
       a.textContent = 'AYAKA 応援サイトを開く／開啟網站';
       body.appendChild(p); body.appendChild(a);
       return;   // 不再執行後面的 render
     }
     ```
     使用者點連結是有 user activation 的導向，瀏覽器允許；`replace()` 保留當作同源嵌入或某些瀏覽器下的附帶嘗試。
  2. 把 `SECURITY.md:19`、`:26` 與 `README.md:151`、`:165` 的說明改成實際行為：「被嵌入時隱藏內容並提供開啟連結；GitHub Pages 無法設定 `X-Frame-Options`／`frame-ancestors`，所以無法完全阻止被框，只能讓被框的頁面無法使用」。
  3. 驗證方式：用另一個 port（例如 `python3 -m http.server 8001`）放一個只有 `<iframe src="http://127.0.0.1:8000/">` 的頁面，打開後 iframe 裡應該只剩那一段文字與連結，點連結後整個視窗跳到本站。可以把這個檢查加進 `scripts/qa.js`。
- 狀態：未處理（`cb1cb13` 完全沒有防護 → `c203b68` 加了 JS 但實測無效）

### S-03　`package-lock.json` 被 `.gitignore` 排除，`npm audit` 無法執行、安裝不可重現

- 嚴重度：低
- 位置：`.gitignore:4`；`package.json:11-14`（devDependencies：`axe-core`、`playwright`）
- 說明與影響：`package.json` 只有兩個開發用套件（品質檢查用，網站本身不需要 npm，訪客不受影響），但 `package-lock.json` 被排除，所以 (1) `npm audit` 在 repo 裡直接執行會失敗（`ENOLOCK`），(2) 每次 `npm install` 都會重新解析版本，拿到的 playwright／axe-core 版本不固定，將來某個新版若有問題也無從比對。影響範圍只有網站主人自己的電腦（執行 QA 時），所以評為低。本輪稽核以暫時產生的 lockfile 執行 `npm audit`：解析到 `playwright 1.64.1`、`playwright-core 1.64.1`、`axe-core 4.14.0`，**0 個已知弱點**。
- 具體建議修法：
  1. 從 `.gitignore` 拿掉 `package-lock.json`，執行 `npm install --package-lock-only` 後把 lockfile commit（只有 3 個套件，檔案很小）
  2. README「測試與品質檢查」加一行 `npm audit`
  3. GitHub → Settings → Code security 開啟 Dependabot alerts（見「建議設定」）
- 狀態：未處理

### S-04　沒有 `.nojekyll` 時，GitHub Pages 的 Jekyll 會把 BRIEF.md／TASKS.md／README.md 轉成載入第三方 script 的網頁

- 嚴重度：中
- 位置：`cb1cb13` 時 repo 根目錄沒有 `.nojekyll`；`c203b68`（commit `547ba3c`）已加入 `.nojekyll`
- 說明與影響：GitHub Pages 預設用 Jekyll 建置，並啟用 `jekyll-optional-front-matter`、`jekyll-default-layout`、`jekyll-readme-index` 等外掛，預設主題是 Primer。因此沒有 `.nojekyll` 的話，根目錄的 `BRIEF.md`、`TASKS.md`、`README.md` 會被轉成 `/ayaka-fansite/BRIEF.html` 等網頁，套用 Primer 版面：從 `cdnjs.cloudflare.com` 載入 anchor-js、含 inline `<script>`，而且沒有 CSP meta，違反「不載入任何第三方資源」與「無 inline 程式」的基準（`index.html` 本身沒有 front matter，會原樣複製，不受影響）。這是依 GitHub Pages 文件記載的預設外掛行為推斷，此環境無法實際執行 GitHub 的 Jekyll 建置。
- 具體建議修法：保留 `.nojekyll`（已做）。README 已說明它的用途；請不要刪除這個檔案。
- 狀態：已修正（`547ba3c` 加入 `.nojekyll`，Pages 會直接發布原始檔）

### S-05　CSP 可加上 Trusted Types 強制，讓「不用 innerHTML 插入資料」由瀏覽器強制執行（縱深防禦）

- 嚴重度：低
- 位置：`index.html:6`、`404.html:6`（CSP meta）
- 說明與影響：目前 `app.js` 完全沒有 HTML sink，這條規則靠人工遵守。加上 `require-trusted-types-for 'script'` 後，Chromium 會在執行期直接擋掉任何把字串指定給 `innerHTML`／`outerHTML`／`insertAdjacentHTML`／`document.write`／`eval`／`srcdoc` 等 sink 的操作（丟 TypeError 並觸發 CSP 違規事件），以後改程式時若不小心用了 innerHTML 會立刻被發現，也讓 `data.js` 被竄改時無法變成 HTML 注入。實測（Chromium 153）：把 CSP 改成 `…; upgrade-insecure-requests; require-trusted-types-for 'script'` 後載入首頁、切換到中文、開燈箱、→ 切換、Esc 關閉，全部正常，0 個 CSP 違規、0 個 console 錯誤。Firefox／Safari 目前不支援這個指令，會忽略，不影響顯示。
- 具體建議修法：兩個 HTML 的 CSP meta 內容結尾加上 `; require-trusted-types-for 'script'`；SECURITY.md 的 CSP 列補一句說明；日後若真的需要 innerHTML，必須透過 `trustedTypes.createPolicy()` 建立政策並在 CSP 加 `trusted-types <政策名稱>`。
- 狀態：未處理

## 已檢查、目前沒有發現問題的項目（`3ea44ac`／`c203b68`）

- **CSP**：`index.html:6` 與 `404.html:6` 都有 `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests`，與基準完全一致，沒有 `'unsafe-inline'`、`'unsafe-eval'`、`*`、`data:`。meta 放在所有 `<link>` 之前。實際載入時 console 沒有任何 CSP 違規；程式用到的功能都在允許範圍內（沒有 fetch／XHR；`new Image()` 預載與 `<picture>` 的 WebP 都是同源；`canvas.toDataURL` 只用來偵測 WebP 支援，不載入資源；manifest 與 icons 同源）。
- **inline 程式**：HTML 內沒有 inline `<script>`、`<style>`、`style=`、`on*`、`javascript:`（grep 與實際 DOM 檢查都確認）。`index.html` 的 `<svg class="brand__mark">` 只用 `fill`／`stroke` 等呈現屬性，不是 `style` 屬性，CSP 不會擋。
- **XSS**：`app.js` 所有寫入畫面都用 `textContent`／`createElement`／`setAttribute`（屬性只有 `src`、`srcset`、`alt`、`width`、`height`、`aria-*`、`datetime`，值都來自 `data.js`）；沒有 `innerHTML`、`outerHTML`、`insertAdjacentHTML`、`document.write`、`eval`、`new Function`、字串形式的 `setTimeout`／`setInterval`。輸入來源：localStorage 的值先用 `LANGS` 白名單檢查（`app.js:19`、`:76`、`:475`），`location.hash` 只做 `=== '#birthday-preview'` 的布林判斷（`app.js:28`、`:497`），沒有讀 query string。動態探針：在 query、hash、localStorage（含壞掉的 JSON、超長字串）注入 `<img onerror>` 都沒有進入 DOM，頁面照常顯示。eslint 的 `detect-object-injection` 警告逐一確認為誤報（key 都來自靜態 HTML 屬性或數字索引）。
- **第三方資源**：實際載入 `index.html` 與 `404.html` 的所有請求都是同源；沒有外部 script、stylesheet、字型（系統字型堆疊）、iframe、分析工具；CSS 沒有 `url()`／`@import`；`favicon.svg` 沒有 script 或外部參照。唯一的絕對網址是 `og:url`、`og:image`、`twitter:image`、`canonical` 與 `data.js` 的 `site.url`，都指向自己的 Pages 網域。網站沒有任何外部連結，所以 `rel="noopener noreferrer"` 目前沒有適用對象（SECURITY.md 已寫明之後新增時要加）。兩頁都有 `<meta name="referrer" content="no-referrer">`。
- **資訊外洩**：41 個圖片檔（9 張 JPEG、27 個 WebP、`og.jpg`、4 個 PNG 圖示）逐一檢查，全部沒有 EXIF／GPS／XMP／IPTC／ICC／註解，JPEG 在 EOI 之後沒有多餘資料；`scripts/make_images.py` 用 Pillow 重新編碼且不帶 exif，產出的 WebP／og.jpg 也確認乾淨。沒有 source map、`.env`、金鑰、`node_modules`、lockfile、建置產物、截圖（`qa-output/` 已在 `.gitignore`）。HTML／JS／CSS 註解只有說明文字，沒有本機路徑或帳號。`data.js` 的個人資料只有 BRIEF.md 允許的四項，其餘為 `null`；留言與照片說明沒有個資。`scripts/`、`test/`、`package.json` 會隨 Pages 公開但內容無害。
- **localStorage**：只有一個鍵 `ayaka-fansite:lang`，讀（`app.js:73-79`）寫（`app.js:80-82`）都在 try/catch 裡，讀出的值不在白名單就回到預設語言；沒有 cookie、sessionStorage、IndexedDB。
- **依賴**：沒有 commit `node_modules` 或建置產物；devDependencies 的 `npm audit` 結果 0 弱點（見 S-03 的說明）。
- **其他**：`countdown.js` 的 UMD 寫法在瀏覽器下 `module` 未定義會走 `root.AyakaCountdown`，安全；`#birthday-preview` 只會把倒數顯示成生日當天的畫面，屬於顯示用途，不是安全問題；`manifest.webmanifest` 的 `start_url`／`scope`／icons 都是相對同源路徑。

## 備註（非問題，供參考）

- `BRIEF.md`、`TASKS.md`、`SECURITY.md` 會隨 GitHub Pages 一起公開；README 的「待確認事項」已說明（內容沒有機密）。現在有 `.nojekyll`，所以 `_config.yml` 的 `exclude` 不再適用，不想公開就只能移到別的分支。
- 之前備註的 `.gitignore` 已在 `cb1cb13` 加入並於 `547ba3c` 補齊（`node_modules/`、`qa-output/`、`.DS_Store` 等）。
- GitHub 上有一個 `claude/vigilant-heisenberg-8n8cil` 分支，內容與 `main` 相同（開發 session 的工作分支）；稽核結束後可以連同兩個 review 分支一起整理或刪除。
- 本報告與 `review-design` 分支的報告都在公開 repo 裡，未修正的問題也會被看到。對純靜態網站來說風險很小。

## 建議設定（GitHub，請網站主人自行處理）

README 與 SECURITY.md（`547ba3c` 之後）已寫入相同的建議，這裡補上從 API 實際查到的狀態。

| 項目 | 目前狀態 | 建議 |
|---|---|---|
| `main` 分支保護 | **未啟用**（07:18 再查仍為 `protected: false`；`review-*` 分支也未保護） | Settings → Rules → Rulesets → New branch ruleset：目標 `main`，勾選「Block force pushes」與「Restrict deletions」（舊版介面是 Settings → Branches → Add branch protection rule，「Allow force pushes」與「Allow deletions」都保持關閉）。不需要勾「Require a pull request」，網站主人仍可直接 push |
| 兩步驟驗證（2FA） | 無法從 API 確認 | Settings → Password and authentication → Two-factor authentication，建議用 passkey 或 authenticator app，並下載 recovery codes；同時到 Settings → Sessions 確認沒有陌生裝置 |
| GitHub Pages：Enforce HTTPS | 無法確認（此稽核環境的 proxy 封鎖 `*.github.io`；README 說 Pages 尚未開啟） | 開啟 Pages 後立刻到 Settings → Pages 勾選「Enforce HTTPS」；開啟後 `http://` 會 301 轉到 `https://` |
| Secret scanning／Push protection | 無法從 API 確認 | 公開 repo 可免費開啟：Settings → Code security → 「Secret protection」與「Push protection」設為 Enabled |
| Dependabot | 無法從 API 確認 | Settings → Code security → 「Dependabot alerts」開啟；配合 S-03 commit lockfile 後才有東西可比對 |
| Email 隱私 | 初始 commit 帶個人 Gmail（見 S-01） | Settings → Emails → 勾「Keep my email addresses private」與「Block command line pushes that expose my email」 |
| Actions 權限 | 目前沒有 workflow | 若之後加 GitHub Actions：Settings → Actions → General → Workflow permissions 設為「Read repository contents and packages permissions」 |

## 稽核紀錄

| 時間（台灣） | `origin/main` | 動作 |
|---|---|---|
| 06:21–06:45 | `f75df84` | 開始稽核；`index.html` 尚未出現。完成照片、repo 歷史、GitHub 設定檢查，寫入 S-01 |
| 06:58 | `cb1cb13` | `index.html` 出現（網站第一版＋首頁排版調整）。完整稽核：CSP／referrer／無 inline／無第三方／XSS 探針全部通過；發現 S-02（當時完全沒有 iframe 嵌入防護） |
| 07:10 | `c203b68` | TASKS 1–4 完成（SECURITY.md、404、WebP、OG、manifest、package.json）。重新稽核：S-02 有加 JS 但跨來源實測無效；新增 S-03；41 個圖片檔中繼資料全部乾淨；npm audit 0 弱點 |
| 07:18 | `3ea44ac` | 只有 README 變更（TASKS 5）。報告更新並 push |
| 07:22 | `3ea44ac` | 收到額度將於 08:15 用完的通知。寫入總結版、「限制內最好的做法與取捨」、S-04（已修正）、S-05；實測 Trusted Types 不影響功能 |
