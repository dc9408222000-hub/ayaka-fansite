# 設計審查報告（design-review.md）

- 審查員：獨立設計審查 session（本分支 `review-design`，不改動 `main`）
- 審查對象：`origin/main` 上的網站（目前審到 commit 3983352）
- 報告格式：每個問題一個條目，編號固定不重複使用；狀態分「未處理／已修正／不適用」；優先度「高」且「未處理」的請先處理
- 最後更新：2026-11-04 07:47（台灣時間）

## 總結與整體評分

**整體評分：8 / 10**（07:47 版，以 main 3983352 為準；修掉 D-51 的重疊即 8.5）

**目前狀態**：58 項中 56 項已修正；未處理 2 項：中 1（**D-51** 桌面倒數格子加寬後與「6.20」裝飾重疊，是 9098310 修正後的新狀況）、低 1（D-32 日文圖說句尾，由網站主人決定）；D-37（年表 2020 年的依據）已加註但需網站主人確認。沒有未處理的高優先項目。

**整體印象**：底子扎實、修得很快的網站。設計變數（色彩、8 階字級、留白、圓角、陰影）完整，白底＋低彩度粉主色＋「虹」漸層細線的點綴克制一致；手機版「照片＋疊上去的名字卡」是全站最有記憶點的畫面，桌面版經過四輪修正後有了照片左側的彩虹軸線、三層名字（AYAKA／彩花／あやか）合理的比例、不再空蕩的構圖，語言切換退到最右端讓品牌與導覽回到該有的重量；相簿在桌面用滿寬度、深色模式照片有降亮度、燈箱鍵盤與觸控各有提示；全站 16 個變體量測沒有任何 WCAG AA 不及格的文字；日文自然、中文是台灣用語、留言日中對照、用語一致。審查期間 main 共 15 個修正 commit，49 項在 45 分鐘內處理完，修法多半優於建議。

**離滿分還差什麼**：
1. **D-51**：桌面倒數卡的四格與「6.20」裝飾互相擠壓，一眼可見，先修。
2. **內容深度（最主要）**：標語與四則留言仍是範例文字、年表只有五個節點（活動名稱待補）、照片說明只有一句動作描述、個人資料五欄待補；版面已為這些留好位置，接下來要靠網站主人自己的話與確認過的事實。
3. **實機驗證**：審查機器以 Noto Sans CJK＋Inter／Liberation Sans 代替，請網站主人在 iPhone／Mac（Hiragino、PingFang、Helvetica Neue Light 的「AYAKA」大字）與 Windows（Yu Gothic／JhengHei；Arial 沒有 300 字重，見 D-58）各看一次，特別注意 12～13px 小字與中文字重。
4. **設計系統收斂**：D-52～D-58 已在 f815ea8 處理（短線 token、字標、桌機小字級、accent 對比、頁尾留白、Segoe UI）；之後新增元件時請沿用這些 token，不要再寫死 px 與字距。
5. **主視覺的「唯一性」**：構圖已經不是模板，但「AYAKA」仍是放大字距的無襯線字；若想再往上，可讓照片壓住名字的一角，或用主人自己拍的照片做季節／活動切換，讓首屏有屬於這個網站的畫面。

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
| 07:15 | cb1cb13 | 第一批問題 D-01～D-12（審查員親自檢視的結果） |
| 07:13 | 3ea44ac | main 推上 TASKS 1～5（設計調整：區塊編號、桌面雙欄側欄標題、品牌標記、照片編號、倒數日期裝飾、WebP／OG／404） |
| 07:19 | 264d663 | main 修正 D-01～D-12；重新截圖（16 變體＋燈箱／焦點）逐項確認 |
| 07:24 | 33e1c3c | main 只有安全性修改（iframe 提示、Trusted Types），不影響畫面 |
| 07:27 | 33e1c3c | D-01～D-12 全部標為已修正；新增 D-13～D-16（審查員）與 D-17～D-37（日文、中文、內容完整度三個面向的交叉審查，已由審查員逐條核對原始碼與截圖）；寫入第一版總結與評分（7/10） |
| 07:31 | e05afcc | main 推上 77a7653「fix D-13 to D-37」；以 375／1280 × 淺色／深色 × 日中 重新截圖，逐項核對 data.js 字串與畫面 |
| 07:34 | e05afcc | D-13～D-15、D-17～D-31、D-33～D-37 標為已修正；D-16、D-32 維持未處理；總結與評分更新為 8/10 |
| 07:36 | e05afcc | 第一眼印象與色彩兩個面向的交叉審查結果（查證者逐條確認）：新增 D-38～D-46，其中 D-38 為高優先；評分暫調 7.5/10 |
| 07:38 | e05afcc | 768／1440 全頁重新截圖確認 77a7653 沒有造成跑版；各寬度版面面向的交叉審查結果：新增 D-47～D-50 |
| 07:41 | c1391aa | 確認 D-16 已修正、桌面主視覺不再有大片空白（D-06）、「彩花」桌面版 44px（D-40 手機版未處理）；新增 D-51（桌面倒數數字溢出格子） |
| 07:42 | c1391aa | 設計系統一致性面向的交叉審查結果（查證者逐條確認，已剔除已修正與重複項）：新增 D-52～D-58（皆為低優先的收斂項） |
| 07:43 | 9098310 | main 推上 d2b727b～9098310「fix D-38 to D-51」；以 375／768／1280／1440 × 淺色／深色 重新截圖逐項確認：D-38～D-50 已修正；D-51 修正後出現新的重疊，維持未處理並更新說明；總結與評分更新為 8/10 |
| 07:47 | 3983352 | main 推上 f815ea8「fix D-52 to D-58」；375／1280 重新截圖確認七項全部已修正；剩 D-51（中）與 D-32（低，主人決定） |

## 問題清單

### D-01 ｜ 優先度：高 ｜ 狀態：已修正
- 位置：首頁主視覺／375／768（720px 以下）／深色
- 現況：手機版的 .hero__caption 用寫死的 rgba(255,255,255,0.82) 白色膠囊底，但文字色跟著 --text-muted 變成深色模式的 #aca3ad，量測對比只有 1.67:1（WCAG AA 需 4.5:1），「2026年8月23日 撮影」在深色模式下讀不到。
- 建議：深色模式另外給值：膠囊底改 rgba(26,23,28,0.72)＋文字 #ece6e9（對比約 12:1），或維持白底但文字改用 #2b282d。720px 以上的版面（標籤移到照片下方、透明底）不受影響。
- 依據：375-dark-ja-diag.json typography：figcaption.hero__caption #aca3ad on #d6d5d6 = 1.67；styles.css .hero__caption 的 background 寫死白色
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：膠囊改用 --badge-bg／--badge-text，深色模式量測 #ece6e9 on #211e24 = 13.4:1

### D-02 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：導覽列／375／兩者
- 現況：第二列導覽 chips 可橫向捲動但捲軸被隱藏（scrollbar-width:none），第 4 項「フォト」剛好收在右邊界，第 5、6 項「メッセージ」「このサイトについて」（右緣 422px／555px）完全在畫面外，沒有任何漸層或箭頭提示；中文版同樣少了「關於本站」。
- 建議：右側加 24px 的淡出遮罩（例如 mask-image: linear-gradient(90deg,#000 calc(100% - 32px),transparent)）並讓最後可見項目露出一半；或在 375 寬度縮小字級到 12px、左右 padding 10px 讓六項都放得下；或改成兩列換行（flex-wrap）。
- 依據：375-light-ja-diag.json overflowing：site-nav__list li:nth-of-type(5) [339,422]、li:nth-of-type(6) [424,555]；
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：導覽 chips 改為有邊框的膠囊、右側 48px 淡出遮罩、scroll-snap 與 aria-current 高亮

### D-03 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：導覽列／375／768／兩者
- 現況：sticky 頁首由品牌列（min-height 60px）＋導覽列（約 42px）組成，實測高度 102px，在 667px 高的手機上固定佔掉 15%，捲動時一直壓在主視覺與內容上。
- 建議：只讓品牌列 sticky（約 60px），導覽列隨頁面捲走；或往下捲時收起導覽列、往上捲才出現；最低限度把品牌列 min-height 降到 52px、chips padding 改 5px 10px，讓總高度 ≤ 88px。
- 依據：375-light-ja-diag.json sections：header h=102；styles.css .site-header{position:sticky}
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：899px 以下品牌列隨頁面捲走、只有導覽列固定；頁首初始 112px，捲動後約 52px

### D-04 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：首頁主視覺／1280／1440／兩者
- 現況：「フォトを見る ›」是 13px/600 的純文字連結（.link-arrow 用 --step--1），在 1280 以上的主視覺裡是唯一的動作元素，卻比 eyebrow 還小；點擊範圍 88×43px。
- 建議：900px 以上字級改 15px（--step-0），或做成 44px 高的膠囊按鈕：padding 10px 20px、border 1px solid var(--line-strong)、hover 時底色 var(--accent-soft)；手機版可維持文字連結。
- 依據：；diag focusables a"フォトを見る" 88x43
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：未確認欄位改成單列「標籤＋膠囊」（375 每列約 50px）、600px 以上兩欄；個人資料區塊 1166→966px

### D-05 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：首頁主視覺／1280／1440／兩者
- 現況：主視覺 min-height: calc(100vh - header)，在 1280×900／1440×900 下內容只有約 310px 高，文字欄從 y≈370 才開始，上方約 290px 空白、下方約 200px 空白，第一眼的重心偏下；照片（425px 寬）與文字之間也沒有呼應的元素把空間用起來。
- 建議：把 min-height 改成 min(100vh - var(--header-h), 760px) 或 78vh，讓第一屏下緣露出下一區的 eyebrow 當捲動提示；或把名字放大到 clamp(4rem, 10vw, 8.5rem)、標語 22px／max-width 20em，並讓 eyebrow 與 CTA 之間的間距從 1.5rem 拉到 2rem，提高文字欄的存在感。
- 依據：；styles.css @media (min-width:900px) .hero__inner{min-height:calc(100vh - var(--header-h))}
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：CTA 改為 44px 高的膠囊按鈕（151×44），手機字級 16px

### D-06 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：個人資料／全部／兩者
- 現況：出身地・身長・血液型・ニックネーム・趣味・特技 五列都只有一顆虛線「準備中」膠囊，每列約 90px，手機上這五列就佔了約 450px（整個區塊高 1166px），視覺上像佔位符堆疊；桌面版 11em 標籤欄右側整排空白。
- 建議：欄位保留（BRIEF 要求寫待補），但改變呈現：600px 以上把「準備中」的列改成兩欄 grid（grid-template-columns:repeat(2,1fr)）、列內距縮到 10px 0；或把五個未確認欄位合併成一列「準備中：出身地・身長・血液型・ニックネーム・趣味・特技」以 13px #6e6771 顯示；並把膠囊的虛線邊框改成純文字避免每列都有框。
- 依據：；diag sections profile h=1166（375）
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：min-height 改為 min(100vh − header, 720px)，1280×900 時主視覺 840px；文字欄上方仍約 250px 空白，若要再收可用 align-items:start＋padding-top 10vh；07:40 於 c1391aa 再確認：桌面主視覺改為 min-height 0＋上下 72px 內距，高度 702px、上方不再有大片空白

### D-07 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：全站／全部／兩者
- 現況：:focus-visible{outline:3px solid var(--focus); outline-offset:3px; border-radius:4px} 對沒有自訂圓角的元素（例如導覽 chips 以外的連結）在取得焦點時會變成 4px 圓角；膠囊與圓形按鈕目前只因宣告順序（.lang-switch__btn、.lightbox__btn 寫在後面）才沒有被改成方角，之後調整 CSS 順序就會出現焦點時形狀跳動。
- 建議：把 border-radius 從全域 :focus-visible 移除，改在需要的元素上個別設定；outline 本來就會沿著元素自己的 border-radius 畫。
- 依據：styles.css :focus-visible 區塊；
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：新增 lightboxHintTouch，(hover:none) and (pointer:coarse) 時顯示滑動提示

### D-08 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：年表／375／兩者
- 現況：「NiziU ベストアルバム『Portfolio』リリース」在 375 寬度（19px）換行時斷在「リリ／ース」，一個外來語被拆開，標題讀起來卡。
- 建議：對 .timeline__title 加 word-break: auto-phrase（Chrome 119+，其他瀏覽器自動忽略）並用 overflow-wrap: anywhere 保底；或在 data.js 把標題縮短為「ベストアルバム『Portfolio』発売」，讓它在 375 寬度收在兩行內且不拆字。
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：日期縮為 11px 並加 01～09 編號；日期仍每張重複但已不干擾，可接受

### D-09 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：相簿／全部／兩者
- 現況：區塊引言已說明「2026年8月23日、イベント会場で撮影した写真です」，九張照片下方又各自顯示「2026年8月23日 撮影」，兩行說明讓格子底部變得吵雜。
- 建議：日期仍可保留（TASKS 要求每張顯示日期），但改為與說明同一行、放在說明之後，格式縮短成「2026.08.23」用 12px tabular-nums #6e6771；或把日期改成 11px 並與說明間距縮到 0。
- 依據：、1280 gallery 區；data.js photos 全部 date 相同
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：.messages 加 align-items:start

### D-10 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：放大檢視／375／768／兩者
- 現況：燈箱底部的「← → で切り替え、Esc で閉じる」在手機和平板上也顯示，但這些裝置沒有方向鍵和 Esc；實際已支援左右滑動切換卻沒有告知。
- 建議：用 @media (hover: none) 或 (pointer: coarse) 把提示換成「左右にスワイプで切り替え」／「左右滑動切換」，桌面版維持鍵盤提示。
- 依據：；app.js 的 touchstart/touchend 已實作滑動
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：.site-footer__line 加 text-wrap:balance、max-width 24em

### D-11 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：應援留言／768／1280／1440／兩者
- 現況：700px 以上留言是 2 欄 grid，第 4 則較短的留言被拉到與第 3 則同高，卡片底部多出約 40px 空白；第 1、2 則也因字數不同而不等高。
- 建議：grid 加 align-items: start 讓卡片依內容高度；或讓留言字數相近（30–45 字）；若要維持等高，就把引號裝飾改放卡片頂端、署名固定在底部（卡片 display:flex; flex-direction:column; .message__from{margin-top:auto}）。
- 依據：（舊截圖含燈箱測試區）、
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：.timeline__title 加 text-wrap:balance 與 word-break:auto-phrase

### D-12 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：頁尾／375／兩者
- 現況：頁尾兩行 13px 置中文字在 375 寬度各自折成兩行，第二行只剩「ありません。」「ください。」幾個字，閱讀節奏被打斷。
- 建議：對 .site-footer__line 加 text-wrap: balance（或 pretty），並限制 max-width: 22em; margin-inline:auto；或在 480px 以下改為靠左對齊。
- 紀錄：07:15（main cb1cb13） 發現；07:30 於 264d663 確認：全域 :focus-visible 的 border-radius 已移除
### D-13 ｜ 優先度：高 ｜ 狀態：已修正
- 位置：相簿／1280／1440／兩者
- 現況：3ea44ac 起 900px 以上每個區塊改成「320px 標題欄＋內容欄」的雙欄 grid，相簿的 3 欄格子被塞進約 690px 寬的內容欄，縮圖從 325×407px 縮成 195×243px（1440 也只有約 230px），而左邊 320px 的欄位除了「04 PHOTOS／フォト」之外整段空白；照片是這個網站最重要的資產，桌面版反而比 768 平板（約 230px）還小。
- 建議：讓相簿跳出雙欄：#gallery .section__inner { display:block } 並把標題欄改回區塊上方，格子用 repeat(4, 1fr)（1080px 內每張約 250px）或 repeat(3, 1fr)（約 340px），gap 20–24px；或維持雙欄但讓 .gallery { grid-column: 1 / -1 } 跨到整個內容寬度、標題欄只保留在第一列。同樣的檢查也適用於年表與留言（內容欄 690px 內 2 欄留言卡片只有約 330px 寬）。
- 依據：（3ea44ac）；summary.md images：ayaka-01 195x243（1280）vs 325x407（cb1cb13）；styles.css @media(min-width:900px) .section__inner{grid-template-columns:320px minmax(0,1fr)}
- 紀錄：07:30（main 3ea44ac／264d663） 發現；07:40 於 77a7653 確認：#gallery／#messages 的 section__inner 改回單欄、標題回到上方，1280 相簿縮圖回到 325×407px、三欄、間距 24px

### D-14 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：全站（各區塊標題欄）／1280／1440／兩者
- 現況：900px 以上 .section__title 降為 24px、.section__lead 降為 13px 的淡色字（#6e6771），放在 320px 的側欄裡；引言是每個區塊的說明句（例如「2026年8月23日、イベント会場で撮影した写真です。タップすると大きく表示できます。」），13px 一行約 24 字、折成 3 行，與 44px 的倒數數字、20px 的年表標題相比層級失衡，也比手機版（16px）更難讀。
- 建議：側欄維持 24–28px 的標題，但引言至少 15px（--step-0 的 17px 更好）、行高 1.7、顏色維持 --text-muted；側欄寬度可放寬到 360px 讓引言兩行內收齊；若要保留 13px，只能用在 eyebrow 這種標籤，不要用在說明句。
- 依據：（3ea44ac）；summary.md text styles：p.section__lead 13px/1.8（1280）
- 紀錄：07:30（main 3ea44ac／264d663） 發現；07:40 於 77a7653 確認：側欄加寬到 360px，引言 17px／行高 1.7

### D-15 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：生日倒數／1280／1440／兩者
- 現況：900px 以上倒數卡改成「內容欄＋裝飾欄」兩欄，內容靠左、35% 透明的「6.20」貼在右上角，卡片右下約 1/3 面積空白；倒數數字（44px）與裝飾數字（約 64px）沒有對齊基準，整張卡像兩個不相干的物件。
- 建議：把裝飾欄 align-self 改為與倒數數字列對齊（grid-row 對到 .countdown、align-self:center），或把「6.20」放到右下角與「24歳の誕生日まで」同一基線；也可把卡片 max-width 從 760px 收到 640px 讓空白減少。
- 依據：（264d663）；styles.css @media(min-width:900px) .birthday{grid-template-columns:minmax(0,1fr) auto}
- 紀錄：07:30（main 3ea44ac／264d663） 發現；07:40 於 77a7653 確認：404 加上花朵標記＋「AYAKA」字樣，連結合併為「トップページへ／回到首頁」

### D-16 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：404 頁／全部／兩者
- 現況：404.html 只有「404」數字、日中兩行標題與兩個並排的「トップページへ ›／回到首頁 ›」連結，沒有品牌標記或「AYAKA」字樣，訪客看不出這是哪個網站；兩個同功能連結並排也容易被誤會是兩個去處。
- 建議：在「404」上方加上 header 同款的花朵標記＋「AYAKA」字樣（22px 圖示、19px 字距 0.18em），或在底部加頁尾同款的 AYAKA＋彩虹短線；連結改成一個「トップページへ／回到首頁 ›」，或讓兩個連結上下排列並加上語言標籤。
- 依據：out-3ea44ac-404/；404.html
- 紀錄：07:30（main 3ea44ac／264d663） 發現；07:40 於 77a7653 確認：卡片縮為 680px、align-items 改 center，但「6.20」仍貼在右上角（y≈150）、沒有與數字列（y≈280）對齊；若保留裝飾，請讓它與 .countdown 同一列垂直置中，或移到右下與「24歳のお誕生日を迎えます」同基線；07:40 於 c1391aa 確認：「6.20」改到數字列、垂直置中、靠右，不再各據一角
### D-17 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：全站／全部／兩者
- 現況：日文：<title>、頁首副標、關於區用「非公式応援サイト」，主視覺 eyebrow、meta description、頁尾用「非公式ファンサイト」，1280 首屏頁首的「非公式応援サイト」與正下方 eyebrow 的「非公式ファンサイト」同畫面出現；中文同樣在「應援網站」與「粉絲網站」之間跳動。相簿也一樣：區塊標題／導覽／CTA 是「フォト」，meta description 與年表註解卻是「フォトギャラリー」；description 寫「誕生日カウントダウン」，區塊標題是「バースデーカウントダウン」。
- 建議：頁尾依 BRIEF 保留「非公式ファンサイトです／非官方粉絲網站」那句，其餘統一為「非公式応援サイト／非官方應援網站」：data.js 改 hero.eyebrow（ja『NiziU AYAKA 非公式応援サイト』、zh『NiziU AYAKA 非官方應援網站』）與 site.description 的 ja／zh；相簿統一用畫面上的詞：site.description.ja 改成『…プロフィール、バースデーカウントダウン、ヒストリー、フォト、応援メッセージ。』，timeline[4].note.ja 的「フォトギャラリー」改「フォト」。
- 依據：data.js site.title／site.description／hero.eyebrow／ui.brandSub／about.paragraphs[0]／footer.disclaimer／ui.galleryTitle／timeline[4].note；（頁首與 eyebrow 同屏）
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：eyebrow、description 統一為「応援サイト／應援網站」，頁尾依 BRIEF 保留「ファンサイト／粉絲網站」；description 的「フォトギャラリー」改「フォト」

### D-18 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：導覽列／關於／全部／兩者
- 現況：中文版導覽第 6 項是「關於本站」，點過去的 h2 卻是「關於這個網站」；日文版兩處都是「このサイトについて」。點了連結找不到同名標題，像跳錯區。
- 建議：統一為「關於本站」：data.js ui.aboutTitle.zh 改為「關於本站」（navAbout 不動）。
- 依據：導覽列； h2；data.js ui.navAbout／aboutTitle
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：ja『…まで、あと』＋『{age}歳のお誕生日を迎えます』、zh『…還有』＋『即將迎來 {age} 歲生日』

### D-19 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：個人資料／全部／兩者
- 現況：中文版第一列「姓名：AYAKA（彩花）」緊接第二列「本名：新井彩花」；台灣用法「姓名」就是正式全名，讀者會疑惑哪個才是名字。日文「名前」是泛稱，問題較小。
- 建議：profile[0].label.zh 改為「藝名」（日文可維持「名前」或改「活動名」），其餘欄位不動。
- 依據：第 1、2 列；data.js profile[0]
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：zh 標籤改為「藝名」

### D-20 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：個人資料／年表／全部（375 時年表標題折成兩行）／兩者
- 現況：切到繁中後，個人資料標籤是「虹プロジェクト（Nizi Project）」、年表第 2 筆是「虹プロジェクト（Nizi Project）最終第 8 名」：片假名在前、英文在括號裡，看起來像沒翻到；「最終第 8 名」少了「排名」二字，在中文裡不成語；375 寬度下這行折成兩行。
- 建議：profile[3].label.zh→「Nizi Project（虹プロジェクト）」、profile[3].value.zh→「最終排名第 8 名」；timeline[1].title.zh→「Nizi Project 最終排名第 8 名」。中文譯名（例如「虹計畫」）台灣媒體寫法不一，未確認前不要加。
- 依據：第 4 列、 第 2 筆；data.js profile[3]、timeline[1]
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：「Nizi Project（虹プロジェクト）」「最終排名第 8 名」、年表「Nizi Project 最終排名第 8 名」（交叉審查的查證者認為原本的「最終第 8 名」也是 BRIEF 用語，此項實際只是順序與一致性，優先度應為低）

### D-21 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：生日倒數／全部／兩者
- 現況：日文：數字上方 13px『次の誕生日（6月20日・日本時間）まで』與下方 19px『24歳の誕生日まで』都以「まで」收尾，缺少倒數慣用的「あと」；中文：『距離下一個生日（6 月 20 日・日本時間）還有』→ 數字 →『距離 24 歲生日』，最醒目的最後一行沒有謂語，像被截掉，而且兩行都以「距離」開頭。
- 建議：ui.birthdayLead.ja→『次の誕生日（6月20日・日本時間）まで、あと』、ui.birthdayUntil.ja→『{age}歳のお誕生日を迎えます』；ui.birthdayLead.zh→『距離下一個生日（6 月 20 日，日本時間）還有』、ui.birthdayUntil.zh→『即將迎來 {age} 歲生日』。生日當天的祝福文案兩種語言都自然，不用改。
- 依據：、eve-text.txt；data.js ui.birthdayLead／birthdayUntil
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：aboutTitle.zh 改為「關於本站」（查證者認為此項優先度應為低）

### D-22 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：年表／全部／兩者
- 現況：2026-08-23 節點標題只有『イベントに参加／參加活動』，放在 AYAKA 的年表裡會讀成「AYAKA 去參加了某活動」；是什麼活動沒寫，要讀到 13px 的註解才知道是網站主人去拍照。活動名稱未知卻沒有像其他未確認欄位那樣標「待補」。
- 建議：標題改為『サイト管理人がイベントに参加／網站主人參加活動』，註解開頭加『イベント名：確認中／活動名稱：待補』，並在 data.js 這筆旁加註解提醒主人補活動名稱（不確定就維持待補，不要推測活動性質）。
- 依據：；data.js timeline[4]
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：每張卡下方加另一語言 13px（#6e6771 on #f8f1f4 = 4.9:1），並標 lang 屬性

### D-23 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：應援留言／全部／兩者
- 現況：data.js 的 4 則留言都有 ja／zh，但 app.js renderMessages 只輸出 t(msg) 一種語言：日文模式整張卡只有日文、中文模式只有中文。TASKS 第 1 項寫的是「3～5 段日中對照的範例留言」，而且留言對象 AYAKA 讀的是日文，中文模式下她反而讀不到。
- 建議：每張卡同時放兩種語言：主要語言維持 16px/1.9，另一語言 13px/1.8、顏色 --text-muted、上方間距 8px；日文模式日文在上、中文模式中文在上。renderMessages 多 append 一個 p.message__text--sub 即可。
- 依據：app.js renderMessages、
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：關於區改為三段（ja／zh），措辭與頁尾錯開並加入更新方針

### D-24 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：關於／頁尾／全部／兩者
- 現況：關於區：『このサイトは、ひとりのWithU（NiziUのファン）が作った非公式の応援サイトです。NiziUおよび所属事務所とは一切関係ありません。』『掲載している写真はすべてサイト管理人が撮影したものです。無断転載はご遠慮ください。』，緊接的頁尾又是『非公式ファンサイトです。NiziUおよび所属事務所とは関係ありません。』『写真はサイト管理人が撮影したものです。無断転載はご遠慮ください。』；375 下兩區相距不到一個螢幕，同樣的話連讀兩次。中文版同樣，且譯文少了「一切（完全）」「無断（未經同意）」的語意。
- 建議：頁尾維持 BRIEF 要求的兩句；關於區改成三段、措辭與頁尾錯開並交代更新方針（不新增未確認事實）。ja：①『このサイトは、ひとりのWithU（NiziUのファン）が個人で運営している非公式応援サイトです。NiziUおよび所属事務所とは一切関係ありません。』②『掲載している写真はすべて、2026年8月23日のイベント会場でサイト管理人が撮影したものです。写真・文章の無断転載はご遠慮ください。』③『プロフィールやヒストリーは、確認できた情報だけを載せています。確認でき次第、少しずつ書き足していきます。』zh：①『這是一位 WithU（NiziU 粉絲）個人經營的非官方應援網站，與 NiziU 及其所屬公司完全無關。』②『網站上的照片都是網站主人 2026 年 8 月 23 日在活動現場親自拍攝的，照片與文字請勿擅自轉載。』③『個人資料與年表只放已經確認的資訊，確認後會再慢慢補上。』
- 依據：；data.js about.paragraphs／footer
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：標題『サイト管理人がイベントに参加／網站主人參加活動』，註解開頭『イベント名：確認中／活動名稱：待補』，data.js 加了提醒註解

### D-25 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：全站（head）／全部／兩者
- 現況：title 為「AYAKA（彩花）非公式応援サイト」／「AYAKA（彩花）非官方應援網站」，只有 meta description 提到 NiziU；og:title 同樣。
- 建議：site.title 改為『AYAKA（彩花）非公式応援サイト｜NiziU』／『AYAKA（彩花）非官方應援網站｜NiziU』（約 21 個全形字，分頁與搜尋結果不會被截斷），index.html 的 <title> 與 og:title、twitter:title 一併更新。
- 依據：data.js site.title；index.html <title>／og:title
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：placeholder.ja「確認中」、dateUnknown.ja「日付：確認中」

### D-26 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／相簿／放大檢視／全部／兩者
- 現況：ui.photoCaptionDate.zh 是『{date} 拍攝』，套用後變成「2026 年 8 月 23 日 拍攝」，「日」與「拍攝」之間留一個半形空格，全站出現 11 次（主視覺 1、相簿 9、燈箱 1）；中文圖說慣用「攝於 ○年○月○日」。
- 建議：ui.photoCaptionDate.zh 改為『攝於 {date}』，呈現為「攝於 2026 年 8 月 23 日」；日文維持『{date} 撮影』。
- 依據：；summary.md 375-light-zh images cap；data.js ui.photoCaptionDate
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：zh 圖說改為「攝於 {date}」

### D-27 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：個人資料／年表／全部／兩者
- 現況：出身地／身長／血液型／ニックネーム／趣味・特技顯示『準備中』、年表虹プロジェクト顯示『日付：準備中』；日文的「準備中」是「資料在手上、正在整理」，但區塊引言說『確認できている情報だけを載せています。』，實情是「尚未確認」，語意有落差。
- 建議：ui.placeholder.ja→『確認中』、ui.dateUnknown.ja→『日付：確認中』（更保守可用『未確認』）；「準備中」留給 timelinePlaceholder 這種「之後會補」的欄位。中文「待補」可維持。
- 依據：；data.js ui.placeholder／dateUnknown
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：zh 改用全形逗號、「興趣／專長」、「分鐘」

### D-28 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：生日倒數／個人資料／全部／兩者
- 現況：『距離下一個生日（6 月 20 日・日本時間）還有』與標籤『興趣・專長』的分隔符是片假名中點「・」（U+30FB），在繁中字型下偏小偏低；四格單位「天／小時／分／秒」的「分」直接沿用日文，台灣介面多寫「分鐘」。
- 建議：ui.birthdayLead.zh 改用全形逗號「，」、profile 最後一筆 label.zh 改為「興趣／專長」（全形斜線）；ui.unitMinutes.zh 改為「分鐘」（日文維持「分」）。
- 依據：data.js ui.birthdayLead.zh、profile[9].label.zh、ui.unitMinutes.zh；
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：留言 1、4 與引言的中文已依建議改寫

### D-29 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：個人資料／年表／全部／兩者
- 現況：個人資料本名『新井 彩花』（姓名間有空格）vs 年表註解『本名・新井彩花。』（無空格，且用中點接名字像條列）；個人資料『最終順位 8位』（有空格）vs 年表『虹プロジェクト 最終順位8位』（無空格）。同一事實兩處寫法不同。
- 建議：本名統一為『新井 彩花』；年表誕生節點的註解改為『本名は新井 彩花。』或直接留空（個人資料已有）；順位統一為『最終順位8位』（profile[3].value.ja 去掉空格）。
- 依據：；data.js profile[1]／profile[3]／timeline[0].note／timeline[1].title
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：年表引言與 7/1 註解改為完整句

### D-30 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：年表／全部／兩者
- 現況：引言「從已確認的事件開始，之後慢慢補上。」缺主語動詞，像備忘；2026-07-01 的註解「活動現場海報上的資訊。」只是名詞片語，日文原文是完整句、說明資料來源。
- 建議：ui.timelineLead.zh→『先列出已確認的事件，之後再慢慢補上。』；timeline[3].note.zh→『資料來源：活動現場的海報。』
- 依據：；data.js ui.timelineLead、timeline[3].note
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：『本名は新井 彩花。』、『最終順位8位』兩處統一

### D-31 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：年表／全部／兩者
- 現況：引言『確認できている出来事から、少しずつ書き足していきます。』與底部虛線框『これからの出来事も、ここに書き足していきます。』同一區塊內同一句型，375 下相距約 600px，一眼看到重複。
- 建議：ui.timelinePlaceholder.ja→『これからの出来事は、確認でき次第ここに追加します。』；引言不動。
- 依據：；data.js ui.timelineLead／timelinePlaceholder
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：空白欄位改為『これからの出来事は、確認でき次第ここに追加します。』

### D-32 ｜ 優先度：低 ｜ 狀態：未處理
- 位置：年表／全部／兩者
- 現況：264d663 把 timeline[1].date 從 null 改成 '2020'（畫面顯示「2020年」）。BRIEF 只給了「虹プロジェクト最終第 8 名」與「2020 年 12 月出道」，沒有給最終順位的年份；這個年份是推論出來的。
- 建議：若網站主人能確認就在 data.js 這筆加註解寫明依據；不能確認就改回 null（顯示「日付：確認中／日期：待補」），遵守「不確定就寫待補」的原則。
- 依據：git diff 3ea44ac..264d663 data.js timeline[1].date
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：alt_ja 未更動（照片說明是網站主人提供的，是否統一句尾由主人決定；若不採用可標不適用）

### D-33 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：相簿／放大檢視／全部／兩者
- 現況：名詞句『両手でうさぎ耳のポーズ』『笑顔で拍手』『満面の笑顔』『花の猫耳カチューシャ』、終止形『頬杖をついて微笑む』、て形中斷『腰に手を当てて』『ミッキーのぬいぐるみと』『大きなぬいぐるみを抱えて』『クッションを持って』；1280 的 3 欄下同一列並排時差異明顯。同一字串也作 alt 與燈箱標題。
- 建議：統一為名詞句收尾（caption 與 alt 都通順）：03『頬杖をついた微笑み』、04『腰に手を当てたポーズ』、05『ミッキーのぬいぐるみと一緒に』、06『大きなぬいぐるみとのツーショット』、08『クッションを手にした一枚』；01、02、07、09 保留。說明是網站主人提供的，是否採用由主人決定。
- 依據：；data.js photos[].alt_ja
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：『写真を選ぶと大きく表示できます。』

### D-34 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：相簿／1280／1440／兩者
- 現況：1280／1440 的相簿引言同樣是『…タップすると大きく表示できます。』，桌機是用滑鼠點擊；中文「點一下可以放大瀏覽」則通用。
- 建議：ui.galleryLead.ja 改為『2026年8月23日、イベント会場で撮影した写真です。写真を選ぶと大きく表示できます。』
- 依據：；data.js ui.galleryLead.ja
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：messageFrom 留空、引言改為『サイト管理人から、AYAKAちゃんへ。…』，app.js 空字串時不建立署名

### D-35 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：應援留言／全部／兩者
- 現況：第 1 則「…連我也跟著有了精神。」（「有了精神」不是台灣慣用說法）；第 4 則「最喜歡無論何時都自在發光的 AYAKA。」漏掉日文「自分らしく（做自己）」的意思；引言「給 AYAKA 的小小應援。」比日文「ささやかな応援の言葉」少了「幾句話」的具體感。其餘兩則與語氣（溫柔、用「妳」）都沒問題。
- 建議：messages[0].zh→『謝謝妳總是帶來這麼棒的歌聲與舞蹈。看到 AYAKA 的笑容，我也跟著充滿元氣。』；messages[3].zh→『最喜歡無論何時都做自己、閃閃發光的 AYAKA。』；ui.messagesLead.zh→『給 AYAKA 的幾句小小應援。』（都是範例文字，網站主人之後會換）
- 依據：對照 ；data.js messages、ui.messagesLead
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：改為「Messages」

### D-36 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：應援留言／全部／兩者
- 現況：四則留言都出自站長，每張卡結尾各有一行 12px 的『— サイト管理人より』，四次完全相同、沒有資訊量；引言已經說明來源。
- 建議：署名只出現一次：ui.messagesLead.ja→『サイト管理人から、AYAKAちゃんへ。ささやかな応援の言葉です。』（zh『網站主人寫給 AYAKA 的幾句小小應援。』），ui.messageFrom 留空時 renderMessages 不建立 .message__from；之後若有多位留言者再逐卡署名。
- 依據：；app.js renderMessages；styles.css .message__from::before
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：<title>／og:title／twitter:title 加上「｜NiziU」

### D-37 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：應援留言／全部／兩者
- 現況：六個區塊小標依序 Profile／Birthday／History／Photos／Message／About；留言區有 4 則卻用單數。
- 建議：ui.eyebrowMessages 的 ja、zh 都改為『Messages』。
- 依據：；data.js ui.eyebrowMessages
- 紀錄：07:30（main cb1cb13～33e1c3c，文案未變） 發現；07:40 於 77a7653 確認：data.js 已加註「年份依網站主人指示填入」；審查員無法核實這項指示，請網站主人自行確認，若非主人指示請改回待補
### D-38 ｜ 優先度：高 ｜ 狀態：已修正
- 位置：首頁主視覺／768／1280／1440／兩者
- 現況：D-01 的修法給 .hero__caption 加了 backdrop-filter: blur(6px)，但 720px 以上的規則只把膠囊改成透明底放到照片下方，沒有一起關掉 backdrop-filter；透明元素套 backdrop-filter 會把後面的 .hero__glow 重新取樣，在照片正下方形成一塊與照片同寬（1280／1440 約 425×20px、768 約 310×20px）、邊緣筆直的矩形：淺色模式是黃→淡紫的色帶（取樣 (235,226,193)→(216,207,225)），深色模式是偏橄欖灰的亮帶（(81,77,64)→(49,44,54)，底色 #1a171c），看起來像沒刪乾淨的佔位背景，就在第一屏最醒目的照片下緣。
- 建議：在 @media (min-width: 720px) 的 .hero__caption 加上 -webkit-backdrop-filter: none; backdrop-filter: none;（手機版膠囊保留毛玻璃）。若想在照片下方留一條裝飾線，改用 figcaption::before 畫 1px var(--line) 或 2px var(--rainbow) 的細線，不要靠 backdrop-filter 的副作用。
- 依據：照片下方 y≈737–757、 同位置灰帶、 y≈555–575；styles.css .hero__caption 的 backdrop-filter 與 @media(min-width:720px) 的覆寫
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：720px 以上的 .hero__caption 加了 backdrop-filter: none，768／1280／1440 淺色與深色照片下方都不再有色帶

### D-39 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：導覽列／全部／兩者
- 現況：語言切換是 1px 邊框的膠囊群組（兩顆按鈕 67×40、80×40，含外框約 160×48px），選中態 13px/600 的 #b04a67 加 #fbeef2 底；375 時它和 20px 的「AYAKA」並排，是品牌列裡面積最大、對比最強的物件，第一眼先看到「日本語／繁體中文」。900px 以上順序是 品牌→語言切換→導覽：1440 時切換鈕在 x≈450–603、導覽置中在 x≈657–1190，右端 1190–1228 空著，品牌被切換鈕擠成一團、導覽像浮在中間。
- 建議：900px 以上把語言切換移到最右端（.lang-switch { order: 3; margin-left: auto }，導覽靠右接在它左邊）；全寬度把切換鈕降級：高度 32px（padding 0 10px）、字級 12px、群組底 var(--surface-2)、去掉邊框，選中態只留底色＋600 字重；375 的品牌列高度可從約 60px 收到 52px。
- 依據：；1440-light-ja-diag.json focusables：日本語 67×40、繁體中文 80×40、導覽項 96×36
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：900px 以上導覽靠右、語言切換移到最右端（order 3）；切換鈕降為 32px 高、12px 字、無邊框、surface-2 底

### D-40 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：首頁主視覺／全部／兩者
- 現況：375：AYAKA 56px／彩花 23px／あやか 16px；1440：AYAKA 120px／彩花 24px／あやか 17px。羅馬字到漢字一口氣縮到 1/5，「彩花」比各區 h2（手機 28px、桌面 24px）還小、與 19–20px 的標語幾乎同級，第二行讀起來像副標而不是名字；預設語言是日文、受眾是日本粉絲，「彩花」才是她們平常叫的名字，卻是三層裡最弱的一層。
- 建議：.hero__name-kanji 在 375 用 36px（--step-4）、900px 以上 clamp(2.5rem, 3.2vw, 3rem)（40–48px），字重 500、字距 0.12em；あやか 維持 16–17px 但顏色改 var(--text)、字距 0.2em，與短線一起當第三層；AYAKA 在 1440 可降到 104px（6.5rem），讓三層比例接近 4.5：1.7：1。
- 依據：1440-light-ja-diag.json／375-light-zh-diag.json typography：hero__name-latin 120／56.25px、hero__name-kanji 24／23px、hero__name-kana 17／16px、
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:40 於 c1391aa 確認：900px 以上「彩花」已放大到 44px、標語 24px（桌面層級改善），但 375 仍是 23px／16px，手機版尚未處理；07:45 於 9098310 確認：「彩花」手機 30px（1.875rem）、桌面 clamp(2.5rem, 3.2vw, 3rem)；あやか 改為 --text、字距 0.2em；AYAKA 桌面上限 6.5rem

### D-41 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：首頁主視覺／375／兩者
- 現況：375×812 下頁首 112px＋照片（max-height 62vh≈503px）＋重疊的名字卡，主視覺總高 773（zh）～809px（ja），CTA 膠囊落在 y≈795 以下：中文版只露出上半截，日文版（標語折成兩行）整顆在第一屏外；半截按鈕看起來像跑版，第一屏唯一的動作元素也看不到。
- 建議：讓 CTA 底緣落在 780px 內：.hero__frame max-height 從 62vh 降到 54vh（812px 時約 438px），或 .hero padding-top 32→16px、.hero__text padding-top 24→16px、.hero__cta margin-top 24→16px（合計省約 50px）；並把 .hero__slogan 的 text-wrap: balance 改為 pretty，避免日文標語因平衡換行多佔一行。
- 依據：（y≈797–812 只見按鈕上半）、（CTA 不在畫面內）；summary.md 375：section#top h=809（ja）／773（zh）、header h=112
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：照片 max-height 50vh、主視覺與名字卡內距縮小、標語 text-wrap: pretty；375×812 第一屏可完整看到 CTA

### D-42 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：全站／全部／淺色
- 現況：淺色 --text-muted #6e6771：相簿日期 11px 在 #fcf8f9 上 5.19:1、倒數單位 12px 在 #f8f1f4 上 4.91:1、個人資料標籤 13px／頁尾「最終更新」12px 在白底 5.47:1；深色模式同一批元素（#aca3ad）為 6.1–7.3:1。全部過 AA，但 22 個樣式落在 4.5–7 之間，手機戶外閱讀 11px 的相簿日期會吃力。
- 建議：淺色 --text-muted 改 #625b66（白底 6.6:1、#f8f1f4 上約 6.1:1），不需動版面；或至少把 .gallery__date 從 11px 提到 12px、.countdown__unit 顏色改 var(--text) 並降字重。
- 依據：summary.md 1280-light-ja「AA-pass-but-below-7 normal text styles (22)」；1280-light-ja-diag.json typography：gallery__date 11px 5.19、countdown__unit 12px 4.91
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：開場動畫縮成 .hero__figure／.hero__text 兩段（0.6s、延遲 0／0.15s），手機膠囊延遲 0.3s 跟著文字出現

### D-43 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／全部／兩者
- 現況：rise 只有一個 keyframe 沒錯，但套在 figure／eyebrow／name／slogan／cta 五個元素、延遲 0.05～0.62s、每段 0.8s，第一屏要 1.42s 才完整；375 載入瞬間可見相框空白但右上角「2026年8月23日 撮影」膠囊已全亮，名字卡的白底（不在動畫內）先以一塊空白矩形壓在相框上，再逐段浮出文字。
- 建議：縮成兩段：.hero__figure 與 .hero__text 各一個 rise（0.6s，延遲 0 與 0.15s），文字內部不再分段；手機版讓 .hero__caption 的動畫跟著 .hero__text（或 delay 0.3s），避免日期標籤先於照片出現；總時長控制在 0.8s 內。
- 依據：；styles.css .hero__figure～.hero__cta 的 animation-delay
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：直排「あやか／AYAKA」移到照片左側（left:-3rem）、顏色 --text、下方改為 2px×200px 的彩虹軸線

### D-44 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／1280／1440／兩者
- 現況：900px 以上照片右側 2.4rem 外有一行直排 13px、#6e6771、字距 0.5em 的「あやか AYAKA」加 56px 細線，是版面唯一「只有這裡會這樣做」的裝飾，但 1440 下它在 x≈1205–1220 的最右緣、淡到幾乎看不見；內容與左欄的 AYAKA／あやか完全重複，沒有增加資訊也沒形成版面軸線。
- 建議：二選一：(a) 讓它成為軸線：移到文字欄與照片之間（left:-3rem 貼在照片左緣），字級 15px、顏色 var(--text)、細線改 var(--rainbow) 並延長到照片高度的 60%（約 320px）；(b) 不重複名字，改放只有這裡有的內容，例如「2026.08.23」，字級 12px 維持淡色。
- 依據：（x≈1205–1220）；styles.css @media(min-width:900px) .hero__kana-vertical
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：淺色 --text-muted 改為 #625b66（白底 6.6:1）

### D-45 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：相簿／首頁主視覺／全部／深色
- 現況：深色模式有另外調色（背景、彩虹線、glow、陰影），但 .hero__img／.gallery__img 沒有任何 filter，9 張照片以原始亮度直接放在近黑的底上，1280 相簿區像 9 個發光的白色方塊，視線先落在最亮的洋裝而不是臉。
- 建議：在 @media (prefers-color-scheme: dark) 加 .hero__img, .gallery__img { filter: brightness(0.9) contrast(1.02); }，燈箱內與 hover 時 filter: none 維持原色；或把深色相簿區的 --bg-soft 從 #1f1b22 提到 #26212a 縮小明度落差。
- 依據：；styles.css 無任何對 img 的 brightness
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：深色模式 .hero__img／.gallery__img 加 brightness(0.9) contrast(1.02)，燈箱內 filter: none

### D-46 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：放大檢視／全部／兩者
- 現況：.lightbox__btn 的 border rgba(255,255,255,0.28)、底 rgba(255,255,255,0.1) 疊在 rgba(12,10,13,0.96) 上，外框實際約 #504e50，對底色僅 1.5:1（非文字元件建議 3:1），46px 圓圈幾乎看不出輪廓；箭頭只是 11px、1.5px 粗的 chevron，截圖裡左右兩顆明顯比中間的 × 淡，像被停用。
- 建議：border 改 rgba(255,255,255,0.45)（約 3.2:1）、底改 rgba(255,255,255,0.16)，chevron 邊線 1.5→2px、尺寸 11→13px；關閉鈕同步調整以維持三顆一致。
- 依據：底部三顆按鈕；styles.css .lightbox__btn／.lightbox__btn--prev::before；--lightbox-bg
- 紀錄：07:45（main e05afcc；第一眼印象與色彩兩個面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：燈箱圓鈕邊框 0.45、底 0.16，箭頭 13px／2px
### D-47 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：首頁主視覺／768／兩者
- 現況：720px 起 .hero__inner 改成 1.1fr／0.9fr 兩欄、gap 48px，768 寬度下照片欄只剩 310×387px（diag：ayaka-07 310x387），比 375 的 343×429 小、只比相簿縮圖（232×290）大 78px；左欄 69px 的名字卻與照片等高，主視覺高 534px 中底部還有 72px 留白，畫面重心落在文字、照片像縮圖。
- 建議：720–899px 區間把欄比改為 minmax(0,1fr) minmax(360px,0.9fr)、gap 收到 32px，讓照片至少 360×450px；或在這個區間讓照片欄佔 48%（約 350px）並把 .hero 的 padding-bottom 從 72px 收到 48px，讓照片與名字的大小關係跟 1280（425px）一致地「照片為主」。
- 依據：；summary.md 768 images ayaka-07 310x387 vs 375 343x429、1280 425x531；styles.css @media(min-width:720px) .hero__inner
- 紀錄：07:50（main e05afcc；各寬度版面面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：頁尾 max-width 34em＋word-break: auto-phrase，768 以上一句一行

### D-48 ｜ 優先度：中 ｜ 狀態：已修正
- 位置：頁尾／768／1280／1440／兩者
- 現況：D-10 的修法給 .site-footer__line 設 max-width: 24em＋text-wrap: balance，13px 字在 24em（約 312px）內兩句各折成兩行，實際斷點是「非公式ファンサイトです。NiziUおよ／び所属事務所とは関係ありません。」與「写真はサイト管理人が撮影したも／のです。無断転載はご遠慮ください。」，「および」「したもの」被拆開；1440 整頁下方同樣四行，寬螢幕卻只有一條約 310px 的窄柱。
- 建議：max-width 改為 34em（13px 約 442px，768 以上一句一行、375 維持現狀），並加 word-break: auto-phrase 與 line-break: strict；或在兩句之間明確分行、取消 text-wrap: balance，讓每句自成一行。
- 依據：（四行、斷在「およ／び」「したも／のです」）、 頁尾；styles.css .site-footer__line{max-width:24em;text-wrap:balance}
- 紀錄：07:50（main e05afcc；各寬度版面面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：720px 起欄比改為 minmax(0,1fr) minmax(360px,0.9fr)、gap 32px，768 照片 ≥360px

### D-49 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／375（中文版）／768／淺色
- 現況：.hero__glow 用 inset: -12% -18% 向四周外擴，768 時光暈盒右緣到 808px（diag overflowing：hero__glow [387,808]，超出視窗 40px）、375 中文版為 [-46,421]，被 overflow 裁掉後淺色模式右側的粉紫光暈在 x=768 處出現一條垂直硬邊，而不是自然淡出；深色模式 glow 0.45 不明顯。
- 建議：外擴量改成不超出版面：inset: -12% max(-18%, calc(-1 * var(--gutter)))，或把 radial-gradient 的 transparent 停止點從 70% 提早到 60%，讓光暈在到達視窗邊緣前已淡到 0；1280 以上因兩側留白 180px 不受影響。
- 依據：右緣；summary.md 768 overflowing: div.hero__glow [387,808]；styles.css .hero__glow{inset:-12% -18%}
- 紀錄：07:50（main e05afcc；各寬度版面面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：光暈外擴改為 max(-18%, -gutter)、漸層在 60% 淡出，視窗邊緣不再硬切

### D-50 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：個人資料／1280／1440／兩者（深色更明顯）
- 現況：前五列的橫線橫跨整個內容欄（604–1228px，寬 624px），第六列起改為兩欄，橫線變成左 604–892、右 940–1228 兩段、中間 48px 空隙，深色模式下 #322c37 的線在 #1a171c 上缺口一眼可見，像表格排版錯位；兩段的列高（約 56px）也比上方（約 64px）矮，節奏不一致。
- 建議：兩欄區段改用整列一條線：把 border 移到包住兩個子欄的列容器上、子欄之間不畫線；或保留兩段但把 column-gap 縮成 0、用 padding-inline 24px 做間隔讓線條連成一條；列高統一用 padding 14px 0。
- 依據：（y≈422–590 的兩段線與 892–940 缺口）；styles.css @media(min-width:600px) .profile{display:grid;grid-template-columns:repeat(2,…)} 與 .profile__row--placeholder
- 紀錄：07:50（main e05afcc；各寬度版面面向的交叉審查，查證者逐條確認） 發現；07:45 於 9098310 確認：兩欄區段 column-gap 0、改用右側 padding 做間隔，分隔線連成一條（最後一列只有單欄時線只到一半，可接受）
### D-51 ｜ 優先度：中 ｜ 狀態：未處理
- 位置：生日倒數／1280／1440／兩者
- 現況：900px 以上倒數卡改成「內容欄＋6.20 裝飾欄」兩欄後，四個格子只剩約 57px 寬（padding 14px 4px、gap 6px），而 .countdown__num 是 clamp(1.5rem, 1rem + 3.6vw, 2.75rem)＝1440 時 44px、tabular-nums 的三位數「227」實際寬約 77px，左右各溢出格子約 10px，「227」「15」「24」「53」看起來像連在一起的一串數字，格子的淡粉底反而像被切掉的背景。
- 建議：桌面版格子最小寬度 88px（.countdown { grid-template-columns: repeat(4, minmax(88px, 1fr)); gap: 12px }），或把數字在 900px 以上固定為 36px（--step-4 以下）；裝飾欄讓位：.birthday 的 grid-template-columns 改 minmax(0,1fr) minmax(0, 160px)，或在 1100px 以下隱藏裝飾欄。
- 依據：（e05afcc）：格子 693–750px、數字 683–760px；styles.css .countdown__num{font-size:clamp(1.5rem, 1rem + 3.6vw, 2.75rem)}、.countdown__tile{padding:14px 4px 12px}、@media(min-width:900px) .birthday{grid-template-columns:minmax(0,1fr) auto}
- 紀錄：07:40（main c1391aa 確認仍存在） 發現；07:45 於 9098310 確認：格子已加寬到 88px、數字 36px，但 1280／1440 的內容欄只有 648px、卡片實際約 580px 寬，四格總寬 388px 超過左欄（約 302px），右欄的「6.20」與第四格「秒」重疊（1440：x≈1020–1081）。建議：卡片 max-width 改 100%、裝飾欄改 minmax(0,120px) 並在卡片寬度不足 640px 時隱藏裝飾（或把裝飾改回絕對定位在右上角、不佔欄位），格子改 minmax(72px,1fr)
### D-52 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：全站／1280／1440／兩者
- 現況：--step-0～4 在 ≥900px 放大（16→17、28→32、36→44），但 --step--1／--step--2 固定 13／12px，桌機時小字與內文的比例從 0.81 降到 0.76；.gallery__caption 13px/1.5 在 325px 寬的照片下是每格唯一的主文字卻偏小；同一種「灰色小標／日期」有六種字級×字距組合（profile__label、timeline__date、gallery__date、countdown__unit、message__from、site-footer__meta）。
- 建議：在 @media (min-width: 900px) 補 --step--1: 0.875rem（14px）、--step--2: 0.8125rem（13px）；相簿說明改用 --step-0；抽一個 .meta { font-size: var(--step--2); color: var(--text-muted); letter-spacing: .06em; font-variant-numeric: tabular-nums } 給六處共用。
- 依據：summary.md 1280-light-ja font sizes：13、12 未放大；
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：.hero__eyebrow 改為 inline-flex＋::before 彩虹短線、字重 600、字距 0.16em，與區塊 eyebrow 同一套

### D-53 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：全站／全部／兩者
- 現況：--rainbow 以三種形狀出現：3px 全寬條（頁首、生日卡）、24×2px 短線（eyebrow）、44×2px 短線（主視覺標語、頁尾字標、404）。使用本身克制，但 24 與 44 沒有比例關係，眼睛會讀成兩種元件。
- 建議：短線統一一個變數 --dash-w: 32px（或 28px）供 eyebrow、標語、頁尾、404 共用；全寬條維持 3px；頁尾若想更長就用 2 倍（64px）。
- 依據：（44px）與 （24px）；styles.css .eyebrow::before、.hero__slogan::before、.site-footer__brand::after
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：頁尾字標改用 --step-1 與 0.18em，與頁首一致

### D-54 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：導覽列／頁尾／全部／兩者
- 現況：.brand__name 19px（桌機 20px）、字距 0.18em；.site-footer__brand 沒設字級、繼承 16／17px、字距 0.24em。整份 CSS 的 letter-spacing 共 25 處、11 種值（0.02／0.04／0.06／0.08／0.1／0.12／0.16／0.18／0.22／0.24／0.5em），沒有 token。
- 建議：抽一個 .wordmark { font-family: var(--font-display); font-size: var(--step-1); letter-spacing: .2em; font-weight: 500 } 給頁首、頁尾、404 共用；字距收斂成三個 token：--track-s .04em（標題、數字）、--track-m .08em（小標、日期）、--track-l .2em（eyebrow、字標），直排假名的 0.5em 可保留。
- 依據：；styles.css .brand__name／.site-footer__brand
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：900px 以上 --step--1 14px、--step--2 13px；相簿說明改用 --step-0

### D-55 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：導覽列／全部／淺色
- 現況：語言切換鈕的選取態與導覽 chips 的 hover／aria-current 都是 #b04a67 字 on #fbeef2 底、13px，對比 4.63:1（AA 下限 4.5）；CSS 註解只寫「白底 5.2:1」，沒有考慮 soft 底。深色模式對應組合（#eaa8bb on #342a31）約 7.1:1 沒問題。
- 建議：--accent-strong（與 --focus）改 #a03f5c：白底約 6.3:1、#fbeef2 底約 5.5:1；或把 --accent-soft 改更淡的 #fdf5f8 拉開差距。
- 依據：summary.md 各淺色變體 AA-pass-but-below-7：button.lang-switch__btn #b04a67/#fbeef2=4.63；styles.css :root 註解
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：新增 --dash-w: 32px，eyebrow、標語、頁尾、404 共用

### D-56 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／全部／兩者
- 現況：.hero__eyebrow：13px、字重 400、字距 0.12em、內文字型、沒有彩虹短線也沒有編號；.eyebrow：12px、字重 600、字距 0.22em、大寫、display 字型、前綴 24×2px 彩虹線＋「01」編號。兩者功能相同（標題上方的小標），首屏卻與其後六個區塊的節奏對不上。
- 建議：首頁直接套用 .eyebrow（可加編號「00」或不加），日文不受 uppercase 影響；或至少在 .hero__eyebrow 補 ::before 的 24×2px 彩虹線、字重 600、字距 0.16em，字級維持 13px。
- 依據：與 對照；styles.css .hero__eyebrow 與 .eyebrow
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：--accent-strong／--focus 改為 #a03f5c（白底 6.3:1、淡粉底 5.5:1）

### D-57 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：首頁主視覺／生日倒數／全部／兩者
- 現況：--font-display 是 "Helvetica Neue", Helvetica, Arial, …，.hero__name-latin 與 .countdown__num 都設 font-weight: 300。Mac／iOS 的 Helvetica Neue 有 Light，但 Windows 沒有 Helvetica Neue、Helvetica 會被替換成 Arial，而 Arial 沒有 300，瀏覽器改用 400：115px 的「AYAKA」與 44px 的倒數數字在 Windows 會比設計明顯粗一截，與「輕、透」的風格不一致（這是字重可得性，不是審查環境的渲染差異）。
- 建議：在 Arial 前加入有 Light 字重的 Windows 系統字型："Helvetica Neue", "Segoe UI", Helvetica, Arial, …（Segoe UI 有 300 Light）；或把主視覺大字改成 400、字距從 0.16em 放到 0.2em 維持輕盈感。
- 依據：styles.css --font-display、.hero__name-latin{font-weight:300}、.countdown__num{font-weight:300}
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：900px 以上頁尾 padding 改為 72px 0 48px

### D-58 ｜ 優先度：低 ｜ 狀態：已修正
- 位置：頁尾／1280／1440／兩者
- 現況：.section 在 ≥900px 改為上下 72px，.site-footer 卻固定 padding 48px 0 32px：桌機時關於區塊底部 72px、頁尾頂部 48px，border-top 線上下不對稱；頁尾底部 32px 比任何區塊都緊。
- 建議：.site-footer 改 padding: var(--space-6) 0 var(--space-5)，並在 ≥900px 改 var(--space-7) 0 var(--space-6)，與區塊同步縮放。
- 依據：頁尾；styles.css .site-footer{padding}
- 紀錄：07:42（main c1391aa；設計系統一致性面向的交叉審查，查證者逐條確認） 發現；07:46 於 f815ea8 確認：--font-display 在 Arial 前加入 "Segoe UI"
