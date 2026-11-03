# AYAKA（彩花）非官方應援網站

NiziU 成員 AYAKA（彩花）的非官方粉絲網站。純 HTML / CSS / JavaScript，不需要任何建置工具，
放在 GitHub Pages 上就能直接運作。日文／繁體中文可以切換（預設日文），支援深色模式與減少動態效果。

- 網址（開啟 GitHub Pages 之後）：<https://dc9408222000-hub.github.io/ayaka-fansite/>
- 製作說明：[BRIEF.md](BRIEF.md)；第二階段工作清單：[TASKS.md](TASKS.md)；安全說明：[SECURITY.md](SECURITY.md)

## 目錄

1. [檔案說明](#檔案說明)
2. [用 GitHub Pages 發布](#用-github-pages-發布)
3. [怎麼改內容](#怎麼改內容全部在-datajs)
4. [換照片](#換照片)
5. [本機預覽](#本機預覽)
6. [測試與品質檢查](#測試與品質檢查)
7. [安全說明摘要](#安全說明摘要)
8. [帳號安全建議](#帳號安全建議)
9. [第二階段改動清單](#第二階段改動清單)
10. [待確認事項](#待確認事項)

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 頁面骨架。文字都不寫在這裡，由 `app.js` 從 `data.js` 填入（只有 `<title>`、分享預覽的 meta、`<noscript>` 是固定文字） |
| `styles.css` | 樣式：白色系、手機優先、字級與留白系統、深色模式、減少動態效果、404 頁 |
| `app.js` | 把 `data.js` 的內容畫到畫面上、語言切換、生日倒數、相簿放大檢視、WebP 圖片、被 iframe 嵌入時隱藏內容 |
| **`data.js`** | **所有文字與資料都在這裡；要改內容只需改這個檔案** |
| `countdown.js` | 生日倒數的計算（以日本時間 JST 為準，可在 Node 測試） |
| `photos/` | 9 張照片（JPEG）、每張的 WebP 版本（`-480`／`-800`／`-full`）、分享預覽圖 `og.jpg`、`photos.json` |
| `favicon.svg`、`icons/` | 原創的小圖示（花朵＋彩虹）與 PNG 版本（manifest／iOS 用） |
| `manifest.webmanifest` | 加到手機主畫面時用的設定 |
| `404.html` | 找不到頁面時顯示 |
| `.nojekyll` | 讓 GitHub Pages 直接發布檔案，不經 Jekyll 處理 |
| `scripts/make_images.py` | 換照片後重新產生 WebP 與 `og.jpg` |
| `scripts/qa.js` | 品質檢查（headless Chromium 截圖與各項自動檢查） |
| `test/` | `node --test` 的測試：倒數邏輯與 `data.js` 資料完整性 |
| `package.json` | 只用來跑測試與品質檢查（網站本身不需要 npm） |

## 用 GitHub Pages 發布

1. 打開這個 repo 的 GitHub 頁面，點上方的 **Settings**。
2. 左側選單點 **Pages**。
3. 在 **Build and deployment** 的 **Source** 選「**Deploy from a branch**」。
4. **Branch** 選 `main`，資料夾選 `/ (root)`，按 **Save**。
5. 等 1～2 分鐘，頁面上方會出現網址：`https://dc9408222000-hub.github.io/ayaka-fansite/`。
6. 勾選 **Enforce HTTPS**。

之後每次 push 到 `main`，GitHub Pages 都會在一兩分鐘內自動更新。

> 製作時的環境沒有權限呼叫 GitHub 的 Pages API 自動開啟，所以需要照上面的步驟手動開啟一次。

## 怎麼改內容（全部在 `data.js`）

`data.js` 裡每一段文字都有 `ja`（日文）和 `zh`（繁體中文）兩個版本。改完存檔、commit、push 到 `main` 就會更新。
改完可以執行 `node --test` 確認沒有漏掉某一種語言。

### 應援標語、首頁文字

`hero.slogan` 是首頁的應援標語（目前是範例，請換成自己的話）；`hero.eyebrow` 是標語上方的小字。

```js
slogan: {
  ja: 'その笑顔が、今日もわたしの元気のもと。',
  zh: '妳的笑容，是我每一天的元氣來源。'
},
```

### 個人資料

`profile` 陣列裡每一筆是一個欄位。`value: null` 會顯示「準備中／待補」，確認之後改成文字即可：

```js
{ label: { ja: '出身地', zh: '出身地' }, value: { ja: '〇〇', zh: '〇〇' } },
```

### 年表

在 `timeline` 陣列加一筆。`date` 可以寫 `'2027-01-01'`、`'2027-01'` 或 `'2027'`，不確定日期就寫 `null`。
`{ placeholder: true }` 是畫面上「之後會陸續補上」的空白欄位，不需要時可以刪掉。

```js
{
  date: '2027-01-01',
  title: { ja: '出来事のタイトル', zh: '事件標題' },
  note:  { ja: '補足（不要なら空文字）', zh: '補充說明（不需要可留空）' }
},
```

### 應援留言

`messages` 陣列裡每一筆是一張留言卡（目前是 4 則範例，請換成自己的話），建議 3～5 則。

### 其他設定（`site`）

- `lastUpdated`：頁尾的「最後更新」日期（`YYYY-MM-DD`）。
- `defaultLang`：預設語言（`'ja'` 或 `'zh'`）。
- `birthday`：生日（倒數以日本時間計算）。
- `webp`：是否使用 WebP 圖片（換照片後還沒重新產生 WebP 時先改成 `false`）。
- 想預覽「生日當天」的畫面：在網址後面加 `#birthday-preview`。

## 換照片

1. 把新照片放進 `photos/`（建議 4:5 直式、寬度 1280px 左右，先去除 GPS 等拍攝資訊）。
2. 在 `data.js` 的 `photos` 陣列裡改 `src`、`alt_ja`、`alt_zh`、`width`、`height`（格式和 `photos/photos.json` 一樣，可以直接複製貼上）。首頁主視覺是 `hero.photo`。
3. 重新產生 WebP 與分享預覽圖（需要 Python 3 與 Pillow：`pip install Pillow`）：

   ```bash
   python3 scripts/make_images.py
   ```

   這會為每張 `photos/*.jpg` 產生 `-480.webp`、`-800.webp`、`-full.webp`，並從 `photos/ayaka-07.jpg` 裁出 `photos/og.jpg`（分享預覽圖，想換來源請改腳本裡的 `OG_SOURCE`）。
   暫時不想處理 WebP 的話，把 `data.js` 的 `site.webp` 改成 `false` 即可。
4. `photos/photos.json` 是照片說明的原始檔，建議一起更新，方便之後對照。
5. 執行 `node --test`，會檢查照片檔案與 WebP 版本是否都存在。

## 本機預覽

直接用瀏覽器打開 `index.html` 就能看。想和 GitHub Pages 一樣用網址瀏覽：

```bash
python3 -m http.server 8000
```

然後打開 <http://localhost:8000/>。

## 測試與品質檢查

倒數邏輯（含 6/19 23:59:59、6/20 00:00:00、6/21 00:00:00 等日本時間的邊界）與 `data.js` 資料完整性：

```bash
node --test
```

截圖與自動檢查（375／768／1280 寬度、日文／中文、深色模式、減少動態、橫向捲動、CSP、燈箱鍵盤操作、倒數、無障礙 axe-core）：

```bash
npm install
npx playwright install chromium
python3 -m http.server 8000      # 另開一個終端機
node scripts/qa.js http://127.0.0.1:8000/ qa-output
```

截圖與 `report.json` 會放在 `qa-output/`（已在 `.gitignore`）。

檢查開發用套件有沒有已知弱點（只影響執行 QA 的電腦，網站本身不用 npm）：

```bash
npm audit
```

## 安全說明摘要

網站是純靜態、沒有後端、沒有表單、不收集任何資料，也不載入任何第三方資源。
每個頁面都有嚴格的 Content-Security-Policy，所有程式與樣式都放在獨立檔案，寫入畫面只用 `textContent`，
被別的網站用 iframe 嵌入時會隱藏內容、只留下開啟連結（GitHub Pages 無法設定 frame 相關標頭，所以無法完全禁止嵌入）。細節請看 [SECURITY.md](SECURITY.md)。

## 帳號安全建議

- GitHub 帳號開啟 **兩步驟驗證**：Settings → Password and authentication → Two-factor authentication（建議用 passkey 或 authenticator app，並保存 recovery codes）。
- Pages 設定勾選 **Enforce HTTPS**：Settings → Pages。
- 保護 `main` 分支（禁止 force push 與刪除）：Settings → Rules → Rulesets → New branch ruleset，目標 `main`，勾選「Block force pushes」與「Restrict deletions」。
- Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」，避免 commit 帶出個人信箱。

## 第二階段改動清單

依 [TASKS.md](TASKS.md) 的順序：

1. **質感與內容完整度**：字級與留白系統（CSS 變數）、白色系＋低彩度玫瑰色主色、「虹」粉彩漸層細線與主視覺光暈、桌機版區塊標題在左側固定、區塊與照片編號、主視覺（照片／AYAKA／彩花／あやか／標語）分層排版、唯一的開場動畫、深色模式另外調色；年表加入 2026-07-01《Portfolio》發行與 2026-08-23 活動；相簿每張顯示日期與說明；4 則日中對照範例留言；「關於這個網站」；頁尾最後更新日期。
2. **安全強化**：嚴格 CSP、`no-referrer`、沒有 inline 程式與樣式、只用 `textContent` 寫入、被 iframe 嵌入時隱藏內容（S-02）、`.nojekyll`（S-04）、`package-lock.json` 與 `npm audit`（S-03）、CSP 加上 Trusted Types 強制（S-05）、[SECURITY.md](SECURITY.md)、帳號安全建議。
3. **品質檢查**：`scripts/qa.js` 自動截圖與檢查；`test/` 的倒數邊界測試與資料完整性測試；確認相對路徑在 `/ayaka-fansite/` 子路徑與直接開啟 `index.html` 時都正常。
4. **載入速度與分享**：WebP 多尺寸（`<picture>`／`srcset`）、Open Graph／Twitter Card 與 `photos/og.jpg`、原創 favicon 與 manifest、`404.html`。
5. **文件**：本 README。
7. **第二批審查回饋（D-13～D-37）**：桌機相簿與留言區改回整寬（縮圖更大）、側欄引言字級提高、倒數卡裝飾對齊、404 頁加上品牌標記；文案統一為「非公式応援サイト／非官方應援網站」、中文「關於本站」「藝名」「Nizi Project 最終排名第 8 名」「分鐘」「攝於」、倒數文案改為「まで、あと／即將迎來」、年表 2026-08-23 改為「網站主人參加活動（活動名稱：待補）」、關於區改寫為三段、留言卡日中對照並只在引言署名、日文「準備中」改「確認中」、小標 Messages。
8. **第三、四批審查回饋（D-38～D-46 與 D-16 複核）**：主視覺照片下方的色帶（backdrop-filter 副作用）移除、語言切換鈕縮小並移到桌機右端、名字三層比例調整（彩花放大）、手機第一屏放得下 CTA、淺色模式次要文字對比提高、開場動畫縮為兩段、直排「あやか／AYAKA」改為文字與照片之間的彩虹軸線、深色模式照片略降亮度、燈箱按鈕更清楚、倒數卡「6.20」與數字列對齊。
9. **第五批審查回饋（D-47～D-58）**：平板主視覺照片至少 360px 寬、頁尾文字不拆字、主視覺光暈不超出視窗、待補欄位橫線連續、桌機倒數格子放得下三位數、桌機小字級同步放大、彩虹短線長度統一、頁首頁尾字標一致、強調色對比提高、主視覺小標與各區一致、顯示字型加入有 Light 字重的 Segoe UI、頁尾留白與區塊同步。
6. **審查回饋**：依 `review-design` 分支的設計審查（D-01～D-12）與手機 UX 評審修正：深色模式主視覺日期標籤對比、手機導覽列改為可見的膠囊並加右側淡出提示、手機只固定導覽列、倒數數字流體字級（320px 也不擠）、相簿第一張在手機全寬、燈箱在觸控裝置顯示滑動提示並把關閉鈕放在拇指可及處、主視覺 CTA 改為膠囊按鈕、桌機主視覺高度上限、待補欄位精簡（手機單列、600px 以上兩欄）、年表平板以上三欄、留言卡不拉齊高度、頁尾文字平衡換行、焦點框不改圓角、繁體中文改用台灣字型堆疊。

## 審查狀態（兩份審查都已於台灣時間 2026-11-04 08:00 前後結案）

- 安全稽核（`review-security` 分支 `security-audit.md`）：結案，整體風險「低」。S-02～S-05 已由稽核員確認修正；S-01（初始 commit 的個人信箱）需由網站主人決定。
- 設計審查（`review-design` 分支 `design-review.md`）：結案，最終回歸檢查全部通過，58 項中 57 項已由審查員確認修正（評分 8.5/10）；剩下的 D-32（日文圖說句尾）由網站主人決定，年表 2020 年的依據也請網站主人確認。
- 每次修正後都重跑 `node --test`（17 項）與 `scripts/qa.js`（100 項）確認全部通過。

## 待確認事項

- **GitHub Pages 尚未開啟**：請依「用 GitHub Pages 發布」的步驟手動開啟（製作環境沒有 Pages API 的權限）。
- **初始 commit 的作者信箱**（安全稽核 S-01）：`fa239a6` 的 author email 是個人 Gmail。改寫歷史需要 force push，開發時沒有動；是否要清除由網站主人決定（可先到 GitHub → Settings → Emails 開啟信箱隱私設定）。
- **分享預覽與 404 頁的網址**：`index.html` 的 `og:url`／`og:image`／`canonical` 與 `404.html` 裡的 `/ayaka-fansite/` 路徑都寫死為 GitHub Pages 的網址；如果之後改用自訂網域，請一併修改。
- **應援標語與留言**：目前都是範例文字，請換成自己的話（`data.js` 的 `hero.slogan` 與 `messages`）。
- **個人資料的「待補」欄位**：只放了確認過的資訊，其餘留待補充（年表「虹プロジェクト 最終順位8位」的年份依網站主人指示填 2020；設計審查 D-32 建議若無法確認就改回 null）。
- **2026-08-23 的活動名稱**：年表與關於區只寫「活動」，名稱待補（`data.js` 的 `timeline` 有註解）。
- **照片說明的日文句型**（設計審查 D-33）：審查建議把 03／04／05／06／08 的說明統一成名詞句；因為說明是網站主人提供的，這裡沒有改，請自行決定是否採用。
- `BRIEF.md`、`TASKS.md`、`SECURITY.md` 會和網站一起發布在 GitHub Pages 上（內容沒有機密）；不想讓訪客看到的話可以移到別的分支。

## 關於

- 這是非官方粉絲網站，與 NiziU 及其所屬公司無關。
- 照片為網站主人拍攝，請勿轉載。
