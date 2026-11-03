# AYAKA（彩花）非官方應援網站

NiziU 成員 AYAKA（彩花）的非官方粉絲網站。純 HTML / CSS / JavaScript，不需要任何建置工具，
放在 GitHub Pages 上就能直接運作。日文／繁體中文可以切換（預設日文）。

- 網址（開啟 GitHub Pages 之後）：<https://dc9408222000-hub.github.io/ayaka-fansite/>
- 網站內容依照 [BRIEF.md](BRIEF.md) 製作。

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `index.html` | 頁面骨架（文字都不寫在這裡，由 `app.js` 從 `data.js` 填入） |
| `styles.css` | 樣式：白色系、手機優先、深色模式、減少動態效果 |
| `app.js` | 把 `data.js` 的內容畫到畫面上、語言切換、生日倒數、相簿放大檢視 |
| **`data.js`** | **所有文字與資料都在這裡，要改內容只需改這個檔案** |
| `countdown.js` | 生日倒數的計算（以日本時間 JST 為準） |
| `photos/` | 9 張照片與 `photos.json`（每張照片的日中說明與尺寸） |
| `favicon.svg` | 原創的小圖示（花朵＋彩虹） |
| `test/` | 倒數邏輯的測試（`node --test`） |
| `SECURITY.md` | 安全說明 |
| `.nojekyll` | 讓 GitHub Pages 直接發布檔案，不經 Jekyll 處理 |

## 用 GitHub Pages 發布

1. 打開這個 repo 的 GitHub 頁面，點上方的 **Settings**。
2. 左側選單點 **Pages**。
3. 在 **Build and deployment** 的 **Source** 選「**Deploy from a branch**」。
4. **Branch** 選 `main`，資料夾選 `/ (root)`，按 **Save**。
5. 等 1～2 分鐘，頁面上方會出現網址：`https://dc9408222000-hub.github.io/ayaka-fansite/`。
6. 建議勾選 **Enforce HTTPS**。

之後每次 push 到 `main`，GitHub Pages 都會在一兩分鐘內自動更新。

> 這次製作的環境沒有權限呼叫 GitHub 的 Pages API 自動開啟，所以需要照上面的步驟手動開啟一次。

## 怎麼改內容（全部在 `data.js`）

`data.js` 裡每一段文字都有 `ja`（日文）和 `zh`（繁體中文）兩個版本，改完存檔、commit、push 到 `main` 就會更新。

### 改應援標語、首頁文字

`hero.slogan` 是首頁的應援標語（目前是範例，請換成自己的話）。`hero.eyebrow` 是標語上方的小字。

```js
slogan: {
  ja: 'その笑顔が、今日もわたしの元気のもと。',
  zh: '妳的笑容，是我每一天的元氣來源。'
},
```

### 改個人資料

`profile` 陣列裡每一筆是一個欄位。`value: null` 會顯示「準備中／待補」，確認之後改成文字即可：

```js
{ label: { ja: '出身地', zh: '出身地' }, value: { ja: '〇〇', zh: '〇〇' } },
```

### 加年表

在 `timeline` 陣列加一筆。`date` 可以寫 `'2027-01-01'`、`'2027-01'` 或 `'2027'`，不確定日期就寫 `null`。
`{ placeholder: true }` 是畫面上的空白欄位，不需要時可以刪掉。

```js
{
  date: '2027-01-01',
  title: { ja: '出来事のタイトル', zh: '事件標題' },
  note:  { ja: '補足', zh: '補充說明' }
},
```

### 改應援留言

`messages` 陣列裡每一筆是一張留言卡（目前是範例，請換成自己的話），可以自由增減。

### 換照片

1. 把新照片放進 `photos/`（建議 4:5 直式、寬度 1280px 左右、記得先去除 GPS 等拍攝資訊）。
2. 在 `data.js` 的 `photos` 陣列裡改 `src`、`alt_ja`、`alt_zh`、`width`、`height`（格式和 `photos/photos.json` 一樣，可以直接複製貼上）。
3. 首頁主視覺是 `hero.photo`，想換照片就改那裡。
4. `photos/photos.json` 是照片說明的原始檔，建議一起更新，方便之後對照。

### 其他

- `site.lastUpdated`：頁尾的「最後更新」日期。
- `site.defaultLang`：預設語言（`'ja'` 或 `'zh'`）。
- `site.birthday`：生日（倒數以日本時間計算）。

## 本機預覽

直接用瀏覽器打開 `index.html` 就能看。想要和 GitHub Pages 一樣用網址瀏覽，可以在 repo 目錄執行：

```bash
python3 -m http.server 8000
```

然後打開 <http://localhost:8000/>。

## 測試

生日倒數的計算邏輯有測試（包含 6/19 23:59:59、6/20 00:00:00、6/21 00:00:00 等日本時間的邊界）：

```bash
node --test
```

## 安全說明摘要

網站是純靜態、沒有後端、沒有表單、不收集任何資料，也不載入任何第三方資源。
每個頁面都有嚴格的 Content-Security-Policy，所有程式與樣式都放在獨立檔案，寫入畫面只用 `textContent`。
細節請看 [SECURITY.md](SECURITY.md)。

## 帳號安全建議

- GitHub 帳號開啟 **兩步驟驗證**：Settings → Password and authentication → Two-factor authentication（建議用 passkey 或 authenticator app，並保存 recovery codes）。
- Pages 設定勾選 **Enforce HTTPS**：Settings → Pages。
- 保護 `main` 分支（禁止 force push 與刪除）：Settings → Rules → Rulesets → New branch ruleset，目標 `main`，勾選「Block force pushes」與「Restrict deletions」。
- Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」，避免 commit 帶出個人信箱。

## 關於

- 這是非官方粉絲網站，與 NiziU 及其所屬公司無關。
- 照片為網站主人拍攝，請勿轉載。
