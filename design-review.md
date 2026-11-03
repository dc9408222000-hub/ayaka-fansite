# 設計審查報告（design-review.md）

- 審查員：獨立設計審查 session（本分支 `review-design`，不改動 `main`）
- 審查對象：`origin/main` 上的網站（目前審到 commit cb1cb13）
- 報告格式：每個問題一個條目，編號固定不重複使用；狀態分「未處理／已修正／不適用」；優先度「高」且「未處理」的請先處理
- 最後更新：2026-11-04 07:15（台灣時間）

## 總結與整體評分

（審查結束前，台灣時間 10:45，在此填寫總結與 10 分制評分，並寫出離滿分還差什麼。）

## 審查方法

- 每次審查以 `git archive origin/main` 匯出到暫存資料夾，用本機靜態伺服器掛在 `/ayaka-fansite/` 子路徑下（模擬 GitHub Pages），不動 `main`
- headless Chromium（Playwright）在 375／768／1280／1440 寬度 × 淺色／深色模式 × 日文／中文 逐區截圖，並擷取字級、行高、每行字數、文字對比度（WCAG）、圖片尺寸與比例、動畫數、Tab 焦點樣式、相簿放大檢視的鍵盤操作（→、Tab、Esc、焦點是否回到縮圖）、`prefers-reduced-motion`、生日當天／前一天的倒數狀態等資料
- 字型：審查機器上以 Noto Sans CJK JP（日文／中文）與 Inter／Liberation Sans（英數）渲染；網站主人的 Mac／iPhone 會用 Hiragino／PingFang、Windows 用 Yu Gothic／JhengHei，因此字型外觀本身不列入問題，只看字級、行高、間距、對比與版面
- 截圖只留在本機，不 commit

## 審查紀錄

| 時間（台灣） | `origin/main` | 動作 |
| --- | --- | --- |
| 06:22 | f75df84 | 開始審查；`origin/main` 尚未有 `index.html`，每 3 分鐘檢查一次 |
| 07:00 | cb1cb13 | `index.html` 出現，第一輪完整截圖（16 個變體）與審查 |
| 07:15 | cb1cb13 | 第一批問題 D-01～D-12（審查員親自檢視的結果）；多面向交叉審查（排版、色彩、照片、互動、各寬度、日文、中文、內容完整度、設計系統）進行中，結果稍後追加 |

## 問題清單

### D-01 ｜ 優先度：高 ｜ 狀態：未處理
- 位置：首頁主視覺／375／768（720px 以下）／深色
- 現況：手機版的 .hero__caption 用寫死的 rgba(255,255,255,0.82) 白色膠囊底，但文字色跟著 --text-muted 變成深色模式的 #aca3ad，量測對比只有 1.67:1（WCAG AA 需 4.5:1），「2026年8月23日 撮影」在深色模式下讀不到。
- 建議：深色模式另外給值：膠囊底改 rgba(26,23,28,0.72)＋文字 #ece6e9（對比約 12:1），或維持白底但文字改用 #2b282d。720px 以上的版面（標籤移到照片下方、透明底）不受影響。
- 依據：375-dark-ja-diag.json typography：figcaption.hero__caption #aca3ad on #d6d5d6 = 1.67；styles.css .hero__caption 的 background 寫死白色
- 紀錄：07:15（main cb1cb13） 發現

### D-02 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：導覽列／375／兩者
- 現況：第二列導覽 chips 可橫向捲動但捲軸被隱藏（scrollbar-width:none），第 4 項「フォト」剛好收在右邊界，第 5、6 項「メッセージ」「このサイトについて」（右緣 422px／555px）完全在畫面外，沒有任何漸層或箭頭提示；中文版同樣少了「關於本站」。
- 建議：右側加 24px 的淡出遮罩（例如 mask-image: linear-gradient(90deg,#000 calc(100% - 32px),transparent)）並讓最後可見項目露出一半；或在 375 寬度縮小字級到 12px、左右 padding 10px 讓六項都放得下；或改成兩列換行（flex-wrap）。
- 依據：375-light-ja-diag.json overflowing：site-nav__list li:nth-of-type(5) [339,422]、li:nth-of-type(6) [424,555]；
- 紀錄：07:15（main cb1cb13） 發現

### D-03 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：導覽列／375／768／兩者
- 現況：sticky 頁首由品牌列（min-height 60px）＋導覽列（約 42px）組成，實測高度 102px，在 667px 高的手機上固定佔掉 15%，捲動時一直壓在主視覺與內容上。
- 建議：只讓品牌列 sticky（約 60px），導覽列隨頁面捲走；或往下捲時收起導覽列、往上捲才出現；最低限度把品牌列 min-height 降到 52px、chips padding 改 5px 10px，讓總高度 ≤ 88px。
- 依據：375-light-ja-diag.json sections：header h=102；styles.css .site-header{position:sticky}
- 紀錄：07:15（main cb1cb13） 發現

### D-04 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：首頁主視覺／1280／1440／兩者
- 現況：「フォトを見る ›」是 13px/600 的純文字連結（.link-arrow 用 --step--1），在 1280 以上的主視覺裡是唯一的動作元素，卻比 eyebrow 還小；點擊範圍 88×43px。
- 建議：900px 以上字級改 15px（--step-0），或做成 44px 高的膠囊按鈕：padding 10px 20px、border 1px solid var(--line-strong)、hover 時底色 var(--accent-soft)；手機版可維持文字連結。
- 依據：；diag focusables a"フォトを見る" 88x43
- 紀錄：07:15（main cb1cb13） 發現

### D-05 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：首頁主視覺／1280／1440／兩者
- 現況：主視覺 min-height: calc(100vh - header)，在 1280×900／1440×900 下內容只有約 310px 高，文字欄從 y≈370 才開始，上方約 290px 空白、下方約 200px 空白，第一眼的重心偏下；照片（425px 寬）與文字之間也沒有呼應的元素把空間用起來。
- 建議：把 min-height 改成 min(100vh - var(--header-h), 760px) 或 78vh，讓第一屏下緣露出下一區的 eyebrow 當捲動提示；或把名字放大到 clamp(4rem, 10vw, 8.5rem)、標語 22px／max-width 20em，並讓 eyebrow 與 CTA 之間的間距從 1.5rem 拉到 2rem，提高文字欄的存在感。
- 依據：；styles.css @media (min-width:900px) .hero__inner{min-height:calc(100vh - var(--header-h))}
- 紀錄：07:15（main cb1cb13） 發現

### D-06 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：個人資料／全部／兩者
- 現況：出身地・身長・血液型・ニックネーム・趣味・特技 五列都只有一顆虛線「準備中」膠囊，每列約 90px，手機上這五列就佔了約 450px（整個區塊高 1166px），視覺上像佔位符堆疊；桌面版 11em 標籤欄右側整排空白。
- 建議：欄位保留（BRIEF 要求寫待補），但改變呈現：600px 以上把「準備中」的列改成兩欄 grid（grid-template-columns:repeat(2,1fr)）、列內距縮到 10px 0；或把五個未確認欄位合併成一列「準備中：出身地・身長・血液型・ニックネーム・趣味・特技」以 13px #6e6771 顯示；並把膠囊的虛線邊框改成純文字避免每列都有框。
- 依據：；diag sections profile h=1166（375）
- 紀錄：07:15（main cb1cb13） 發現

### D-07 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：全站／全部／兩者
- 現況：:focus-visible{outline:3px solid var(--focus); outline-offset:3px; border-radius:4px} 對沒有自訂圓角的元素（例如導覽 chips 以外的連結）在取得焦點時會變成 4px 圓角；膠囊與圓形按鈕目前只因宣告順序（.lang-switch__btn、.lightbox__btn 寫在後面）才沒有被改成方角，之後調整 CSS 順序就會出現焦點時形狀跳動。
- 建議：把 border-radius 從全域 :focus-visible 移除，改在需要的元素上個別設定；outline 本來就會沿著元素自己的 border-radius 畫。
- 依據：styles.css :focus-visible 區塊；
- 紀錄：07:15（main cb1cb13） 發現

### D-08 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：年表／375／兩者
- 現況：「NiziU ベストアルバム『Portfolio』リリース」在 375 寬度（19px）換行時斷在「リリ／ース」，一個外來語被拆開，標題讀起來卡。
- 建議：對 .timeline__title 加 word-break: auto-phrase（Chrome 119+，其他瀏覽器自動忽略）並用 overflow-wrap: anywhere 保底；或在 data.js 把標題縮短為「ベストアルバム『Portfolio』発売」，讓它在 375 寬度收在兩行內且不拆字。
- 紀錄：07:15（main cb1cb13） 發現

### D-09 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：相簿／全部／兩者
- 現況：區塊引言已說明「2026年8月23日、イベント会場で撮影した写真です」，九張照片下方又各自顯示「2026年8月23日 撮影」，兩行說明讓格子底部變得吵雜。
- 建議：日期仍可保留（TASKS 要求每張顯示日期），但改為與說明同一行、放在說明之後，格式縮短成「2026.08.23」用 12px tabular-nums #6e6771；或把日期改成 11px 並與說明間距縮到 0。
- 依據：、1280 gallery 區；data.js photos 全部 date 相同
- 紀錄：07:15（main cb1cb13） 發現

### D-10 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：放大檢視／375／768／兩者
- 現況：燈箱底部的「← → で切り替え、Esc で閉じる」在手機和平板上也顯示，但這些裝置沒有方向鍵和 Esc；實際已支援左右滑動切換卻沒有告知。
- 建議：用 @media (hover: none) 或 (pointer: coarse) 把提示換成「左右にスワイプで切り替え」／「左右滑動切換」，桌面版維持鍵盤提示。
- 依據：；app.js 的 touchstart/touchend 已實作滑動
- 紀錄：07:15（main cb1cb13） 發現

### D-11 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：應援留言／768／1280／1440／兩者
- 現況：700px 以上留言是 2 欄 grid，第 4 則較短的留言被拉到與第 3 則同高，卡片底部多出約 40px 空白；第 1、2 則也因字數不同而不等高。
- 建議：grid 加 align-items: start 讓卡片依內容高度；或讓留言字數相近（30–45 字）；若要維持等高，就把引號裝飾改放卡片頂端、署名固定在底部（卡片 display:flex; flex-direction:column; .message__from{margin-top:auto}）。
- 依據：（舊截圖含燈箱測試區）、
- 紀錄：07:15（main cb1cb13） 發現

### D-12 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：頁尾／375／兩者
- 現況：頁尾兩行 13px 置中文字在 375 寬度各自折成兩行，第二行只剩「ありません。」「ください。」幾個字，閱讀節奏被打斷。
- 建議：對 .site-footer__line 加 text-wrap: balance（或 pretty），並限制 max-width: 22em; margin-inline:auto；或在 480px 以下改為靠左對齊。
- 紀錄：07:15（main cb1cb13） 發現
