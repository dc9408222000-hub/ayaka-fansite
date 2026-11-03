# 安全稽核報告（security-audit.md）

- 稽核對象：`origin/main`（目前 commit `f75df84`）
- 本報告所在分支：`review-security`。稽核員只讀 `main`，不修改、不 push `main`
- 稽核起始：2026-11-04 06:21（台灣時間）；預計持續到 10:45
- 最後更新：2026-11-04 06:30（台灣時間）
- 編號規則：S-01、S-02…，編號固定不重複使用；狀態為「未處理／已修正／不適用」

## 總結

> 稽核結束前（10:45 前）會在此填入最終的各嚴重度數量與整體風險評估。

**目前狀態（2026-11-04 06:30）**：`origin/main` 還沒有 `index.html`，網站程式碼尚未推上來，因此 CSP、inline 程式、XSS、第三方資源、點擊劫持、localStorage 等項目還無法稽核。已先完成不需要網站程式碼的項目（照片中繼資料與內容、repo 檔案與歷史、依賴、GitHub 設定）。背景每 3 分鐘檢查一次 `origin/main`，`index.html` 出現後立即做完整稽核，之後每 10 分鐘追蹤一次。

| 嚴重度 | 未處理 | 已修正 | 不適用 |
|---|---|---|---|
| 高 | 0 | 0 | 0 |
| 中 | 0 | 0 | 0 |
| 低 | 1 | 0 | 0 |

目前風險評估：**低**（尚無網站程式碼；唯一的問題是 commit 歷史中的個人 email，屬於帳號隱私而非網站漏洞）。

## 問題清單

### S-01　commit 歷史中含有網站主人的個人 Gmail 地址

- 嚴重度：低
- 位置：git 歷史，commit `fa239a6`「Initial commit」的 author email（不在任何檔案裡；其餘 commit 都是 noreply 地址）
- 說明與影響：repo 是公開的，任何人用 `git log`、GitHub 的 `https://github.com/dc9408222000-hub/ayaka-fansite/commit/fa239a6.patch` 或 GitHub API 都能取得作者 email。初始 commit 用的是網站主人的個人 Gmail，而不是 GitHub 提供的 `noreply` 地址。影響：信箱會被爬蟲收集，增加垃圾信與釣魚信（例如假冒 GitHub 的登入通知）的風險；也是把 GitHub 帳號與個人信箱連在一起的線索。因為信箱帳號名稱與 GitHub 使用者名稱相同、額外洩漏的身分資訊有限，所以評為低。
- 具體建議修法：
  1. GitHub → Settings → Emails：勾選「Keep my email addresses private」與「Block command line pushes that expose my email」。之後在 GitHub 網頁上做的 commit 會自動改用 `252630514+dc9408222000-hub@users.noreply.github.com`
  2. 本機若會 commit：`git config --global user.email "252630514+dc9408222000-hub@users.noreply.github.com"`
  3. 既有的 `fa239a6` 只能靠改寫歷史（`git filter-repo --mailmap` 或 GitHub 文件「Changing author info」的流程）清掉。這會改變之後所有 commit 的 SHA、需要 force push，會和正在開發的 session 衝突，建議等開發與稽核都結束後，由網站主人自行決定是否要做。如果決定保留歷史不改，請把本項狀態改為「不適用」並註明。
- 狀態：未處理（需由網站主人處理；開發 session 不應為此 force push `main`）

## 已檢查、目前沒有發現問題的項目

- **照片中繼資料（`photos/ayaka-01.jpg`～`ayaka-09.jpg`，共 9 張）**：這個環境無法安裝 exiftool（apt 不可用），改用三種方法逐張檢查：Pillow 解析 IFD0／Exif／GPS／Interop 各 IFD 與 `info`（ICC、XMP、註解）、exifread 完整解析、以及直接走訪 JPEG 區段表並掃描字串。結果每張都只有一個 `APP0/JFIF` 區段，沒有 `APP1`（EXIF／XMP）、`APP13`（IPTC／Photoshop）、`APP2`（ICC）、`COM` 註解，EOI 之後也沒有多餘位元組（沒有附加隱藏資料）。尺寸與 `photos.json` 記載一致（1162×1452 與 1280×1600），都是縮圖而非原始檔。GPS 與拍攝資訊確認已去除。
- **照片內容**：逐張目視，畫面只有本人與活動現場的海報背景，沒有票券、座位號、含個人資訊的 QR 條碼、手機畫面或可辨識的其他觀眾。
- **repo 檔案與 git 歷史**：`main`、`review-design`、`review-security` 全部歷史裡只有 `README.md`、`BRIEF.md`、`TASKS.md`、各自的 review 說明檔與 `photos/`。沒有 `.env`、金鑰、憑證、source map、`node_modules`、建置產物、編輯器設定檔或 `.DS_Store`；也沒有被刪除過的敏感檔案。
- **`photos/photos.json`**：只有路徑、日期、日中 alt 文字與尺寸；日期 2026-08-23 是網站主人打算在相簿公開顯示的活動日期。
- **依賴**：目前沒有 `package.json`，不需要 `npm audit`。
- **協作者**：只有網站主人（admin）一人，沒有外部協作者。

## 備註（非問題，供參考）

- `BRIEF.md`、`TASKS.md` 位於 `main` 根目錄，GitHub Pages 會把它們和網站一起發布（例如 `…/ayaka-fansite/TASKS.md` 可直接讀）。內容沒有機密（活動日期本來就會顯示在網站上），但如果不想讓訪客看到製作流程，可以加一個 `_config.yml` 寫 `exclude: [BRIEF.md, TASKS.md]`（Pages 預設用 Jekyll 建置，會尊重這個設定；若之後加了 `.nojekyll` 則此法無效，改把文件移到別的分支）。
- 之後做品質檢查若會 `npm i puppeteer`，請先加 `.gitignore`（`node_modules/`、截圖檔、`.DS_Store`），避免把 `node_modules` 或截圖 commit 進 `main`。後續稽核會持續檢查這點。
- 本報告與 `review-design` 分支的報告都在公開 repo 裡，未修正的問題也會被看到。對純靜態網站來說風險很小，但稽核結束後可以考慮刪除兩個 review 分支，或整理成一份已完成的紀錄。

## 建議設定（GitHub，請網站主人自行處理）

| 項目 | 目前狀態 | 建議 |
|---|---|---|
| `main` 分支保護 | **未啟用**（API 回報 `protected: false`；`review-*` 分支也未保護） | Settings → Rules → Rulesets → New branch ruleset：目標 `main`，勾選「Block force pushes」與「Restrict deletions」（舊版介面是 Settings → Branches → Add branch protection rule，勾「Do not allow bypassing」下方的「Allow force pushes」保持關閉、「Allow deletions」保持關閉）。不需要勾「Require a pull request」，網站主人仍可直接 push |
| 兩步驟驗證（2FA） | 無法從 API 確認 | Settings → Password and authentication → Two-factor authentication，建議用 passkey 或 authenticator app，並下載 recovery codes；同時到 Settings → Sessions 確認沒有陌生裝置 |
| GitHub Pages：Enforce HTTPS | 無法確認（此稽核環境的 proxy 封鎖 `*.github.io`，之後若能連線會補驗證） | Settings → Pages → 勾選「Enforce HTTPS」；開啟後 `http://` 會 301 轉到 `https://` |
| Secret scanning／Push protection | 無法從 API 確認 | 公開 repo 可免費開啟：Settings → Code security → 「Secret protection」與「Push protection」設為 Enabled |
| Dependabot | 無法從 API 確認 | 目前沒有依賴，但建議先開 Settings → Code security → 「Dependabot alerts」，之後若加 `package.json` 會自動提醒 |
| Email 隱私 | 初始 commit 帶個人 Gmail（見 S-01） | Settings → Emails → 勾「Keep my email addresses private」與「Block command line pushes that expose my email」 |
| Actions 權限 | 目前沒有 workflow | 若之後加 GitHub Actions：Settings → Actions → General → Workflow permissions 設為「Read repository contents and packages permissions」 |

## 稽核紀錄

| 時間（台灣） | `origin/main` | 動作 |
|---|---|---|
| 06:21–06:30 | `f75df84` | 開始稽核；`index.html` 尚未出現。完成照片、repo 歷史、GitHub 設定檢查，寫入 S-01 |
