/* =====================================================================
   data.js — 網站的所有文字與資料都集中在這個檔案。
   想改文案、換照片、加年表、換應援留言，只要改這裡，存檔後 commit、push 到 main 即可。

   規則：
   - 每段文字都有兩個版本：ja（日文）與 zh（繁體中文）。
   - 照片資料的格式和 photos/photos.json 完全相同（src、date、alt_ja、alt_zh、width、height），
     可以直接從 photos.json 複製貼上。
   - 不確定的資料請保持 null（網頁會顯示「準備中／待補」），不要自己猜。
   ===================================================================== */
window.SITE_DATA = {

  /* ---------- 網站基本設定 ---------- */
  site: {
    defaultLang: 'ja',                       // 預設語言：'ja' 或 'zh'
    storageKey: 'ayaka-fansite:lang',        // 記住語言用的 localStorage 鍵名
    lastUpdated: '2026-11-04',               // 頁尾「最後更新」日期（YYYY-MM-DD）
    birthday: { year: 2003, month: 6, day: 20 }, // 生日（以日本時間計算）
    title: {
      ja: 'AYAKA（彩花）非公式応援サイト',
      zh: 'AYAKA（彩花）非官方應援網站'
    },
    description: {
      ja: 'NiziUのAYAKA（彩花）を応援する非公式ファンサイト。プロフィール、誕生日カウントダウン、ヒストリー、フォトギャラリー、応援メッセージ。',
      zh: '應援 NiziU 成員 AYAKA（彩花）的非官方粉絲網站：個人資料、生日倒數、年表、相簿與應援留言。'
    }
  },

  /* ---------- 首頁主視覺 ---------- */
  hero: {
    eyebrow: { ja: 'NiziU AYAKA 非公式ファンサイト', zh: 'NiziU AYAKA 非官方粉絲網站' },
    name: 'AYAKA',          // 藝名（英文）
    nameKanji: '彩花',      // 漢字
    nameKana: 'あやか',     // 假名
    // ★ 應援標語：這是範例，請換成自己的話
    slogan: {
      ja: 'その笑顔が、今日もわたしの元気のもと。',
      zh: '妳的笑容，是我每一天的元氣來源。'
    },
    sloganNote: { ja: '', zh: '' }, // 標語下方的小字（不需要可留空）
    photo: {
      src: 'photos/ayaka-07.jpg',
      date: '2026-08-23',
      alt_ja: '満面の笑顔',
      alt_zh: '燦爛的笑容',
      width: 1280,
      height: 1600
    }
  },

  /* ---------- 介面文字（按鈕、標題、提示等） ---------- */
  ui: {
    skipLink:        { ja: '本文へスキップ', zh: '跳到主要內容' },
    brandSub:        { ja: '非公式応援サイト', zh: '非官方應援網站' },
    heroCta:         { ja: 'フォトを見る', zh: '看相簿' },
    eyebrowProfile:  { ja: 'Profile', zh: 'Profile' },
    eyebrowBirthday: { ja: 'Birthday', zh: 'Birthday' },
    eyebrowTimeline: { ja: 'History', zh: 'History' },
    eyebrowGallery:  { ja: 'Photos', zh: 'Photos' },
    eyebrowMessages: { ja: 'Message', zh: 'Message' },
    eyebrowAbout:    { ja: 'About', zh: 'About' },
    langLabel:       { ja: '言語を選択', zh: '選擇語言' },
    langJa:          { ja: '日本語', zh: '日本語' },
    langZh:          { ja: '繁體中文', zh: '繁體中文' },
    navLabel:        { ja: 'ページ内ナビゲーション', zh: '頁內導覽' },
    navProfile:      { ja: 'プロフィール', zh: '個人資料' },
    navBirthday:     { ja: 'バースデー', zh: '生日倒數' },
    navTimeline:     { ja: 'ヒストリー', zh: '年表' },
    navGallery:      { ja: 'フォト', zh: '相簿' },
    navMessages:     { ja: 'メッセージ', zh: '應援留言' },
    navAbout:        { ja: 'このサイトについて', zh: '關於本站' },

    profileTitle:    { ja: 'プロフィール', zh: '個人資料' },
    profileLead:     { ja: '確認できている情報だけを載せています。', zh: '只放已經確認的資訊。' },
    placeholder:     { ja: '準備中', zh: '待補' },
    ageSuffix:       { ja: '歳', zh: '歲' },

    birthdayTitle:   { ja: 'バースデーカウントダウン', zh: '生日倒數' },
    birthdayLead:    { ja: '次の誕生日（6月20日・日本時間）まで', zh: '距離下一個生日（6 月 20 日・日本時間）還有' },
    birthdayUntil:   { ja: '{age}歳の誕生日まで', zh: '距離 {age} 歲生日' },
    unitDays:        { ja: '日', zh: '天' },
    unitHours:       { ja: '時間', zh: '小時' },
    unitMinutes:     { ja: '分', zh: '分' },
    unitSeconds:     { ja: '秒', zh: '秒' },
    birthdayToday:   { ja: 'AYAKAちゃん、お誕生日おめでとう！', zh: 'AYAKA，生日快樂！' },
    birthdayTodayLead: { ja: '今日は{age}歳の誕生日。素敵な一年になりますように。', zh: '今天是 {age} 歲生日，祝妳擁有美好的一年。' },
    countdownLabel:  { ja: '誕生日までの残り時間', zh: '距離生日的剩餘時間' },

    timelineTitle:   { ja: 'ヒストリー', zh: '年表' },
    timelineLead:    { ja: '確認できている出来事から、少しずつ書き足していきます。', zh: '從已確認的事件開始，之後慢慢補上。' },
    dateUnknown:     { ja: '日付：準備中', zh: '日期：待補' },
    timelinePlaceholder: { ja: 'ここに新しい出来事を追加できます（data.js の timeline を編集）', zh: '可以在這裡加入新的事件（編輯 data.js 的 timeline）' },

    galleryTitle:    { ja: 'フォト', zh: '相簿' },
    galleryLead:     { ja: '2026年8月23日、イベント会場で撮影した写真です。タップすると大きく表示できます。', zh: '2026 年 8 月 23 日在活動現場拍攝的照片，點一下可以放大瀏覽。' },
    galleryOpen:     { ja: '写真を拡大表示', zh: '放大檢視照片' },
    lightboxLabel:   { ja: '写真の拡大表示', zh: '照片放大檢視' },
    lightboxClose:   { ja: '閉じる', zh: '關閉' },
    lightboxPrev:    { ja: '前の写真', zh: '上一張' },
    lightboxNext:    { ja: '次の写真', zh: '下一張' },
    lightboxCounter: { ja: '{current} / {total}', zh: '{current} / {total}' },
    lightboxHint:    { ja: '← → で切り替え、Esc で閉じる', zh: '← → 切換，Esc 關閉' },

    messagesTitle:   { ja: 'メッセージ', zh: '應援留言' },
    messagesLead:    { ja: 'AYAKAちゃんへ、ささやかな応援の言葉。', zh: '給 AYAKA 的小小應援。' },
    messageFrom:     { ja: 'サイト管理人より', zh: '網站主人' },

    aboutTitle:      { ja: 'このサイトについて', zh: '關於這個網站' },

    footerUpdated:   { ja: '最終更新：{date}', zh: '最後更新：{date}' },
    noscript:        { ja: 'このサイトはJavaScriptを使用しています。ブラウザのJavaScriptを有効にしてご覧ください。', zh: '本網站需要啟用 JavaScript 才能正常顯示。' },
    photoCaptionDate: { ja: '{date} 撮影', zh: '{date} 拍攝' }
  },

  /* ---------- 個人資料 ----------
     value 為 null 時會顯示「準備中／待補」。確認之後再填入 { ja: '…', zh: '…' }。 */
  profile: [
    { label: { ja: '名前',      zh: '姓名' },     value: { ja: 'AYAKA（彩花）', zh: 'AYAKA（彩花）' } },
    { label: { ja: '本名',      zh: '本名' },     value: { ja: '新井 彩花', zh: '新井彩花' } },
    { label: { ja: '生年月日',  zh: '出生日期' }, value: { ja: '2003年6月20日', zh: '2003 年 6 月 20 日' }, showAge: true },
    { label: { ja: '虹プロジェクト', zh: '虹プロジェクト（Nizi Project）' }, value: { ja: '最終順位 8位', zh: '最終第 8 名' } },
    { label: { ja: 'デビュー',  zh: '出道' },     value: { ja: '2020年12月、シングル「Step and a step」でNiziUとして正式デビュー', zh: '2020 年 12 月以單曲〈Step and a step〉隨 NiziU 正式出道' } },
    { label: { ja: '出身地',    zh: '出身地' },   value: null },
    { label: { ja: '身長',      zh: '身高' },     value: null },
    { label: { ja: '血液型',    zh: '血型' },     value: null },
    { label: { ja: 'ニックネーム', zh: '暱稱' },  value: null },
    { label: { ja: '趣味・特技', zh: '興趣・專長' }, value: null }
  ],

  /* ---------- 年表 ----------
     date 可以寫 'YYYY-MM-DD'、'YYYY-MM' 或 'YYYY'；不確定日期時寫 null。
     要留一個空白欄位讓自己之後填，就加一筆 { placeholder: true }。 */
  timeline: [
    {
      date: '2003-06-20',
      title: { ja: '誕生', zh: '出生' },
      note:  { ja: '本名・新井彩花。', zh: '本名新井彩花。' }
    },
    {
      date: null,
      title: { ja: '虹プロジェクト 最終順位8位', zh: '虹プロジェクト（Nizi Project）最終第 8 名' },
      note:  { ja: '', zh: '' }
    },
    {
      date: '2020-12',
      title: { ja: 'NiziUとして正式デビュー', zh: '隨 NiziU 正式出道' },
      note:  { ja: 'シングル「Step and a step」', zh: '單曲〈Step and a step〉' }
    },
    {
      date: '2026-07-01',
      title: { ja: 'NiziU ベストアルバム『Portfolio』リリース', zh: 'NiziU 精選輯《Portfolio》發行' },
      note:  { ja: 'イベント会場のポスターに記載されていた情報です。', zh: '活動現場海報上的資訊。' }
    },
    {
      date: '2026-08-23',
      title: { ja: 'イベントに参加', zh: '參加活動' },
      note:  { ja: 'フォトギャラリーの写真は、この日にサイト管理人が撮影したものです。', zh: '相簿裡的照片都是網站主人這一天拍的。' }
    },
    { placeholder: true }
    /* 新增範例：
    {
      date: '2027-01-01',
      title: { ja: '出来事のタイトル', zh: '事件標題' },
      note:  { ja: '補足（不要なら空文字）', zh: '補充說明（不需要可留空）' }
    },
    */
  ],

  /* ---------- 相簿 ----------
     格式和 photos/photos.json 相同。換照片時：把新檔放進 photos/，再改這裡的 src、alt、尺寸。 */
  photos: [
    { src: 'photos/ayaka-01.jpg', date: '2026-08-23', alt_ja: '両手でうさぎ耳のポーズ', alt_zh: '雙手比兔耳朵', width: 1162, height: 1452 },
    { src: 'photos/ayaka-02.jpg', date: '2026-08-23', alt_ja: '笑顔で拍手', alt_zh: '笑著拍手', width: 1162, height: 1452 },
    { src: 'photos/ayaka-03.jpg', date: '2026-08-23', alt_ja: '頬杖をついて微笑む', alt_zh: '托著臉微笑', width: 1162, height: 1452 },
    { src: 'photos/ayaka-04.jpg', date: '2026-08-23', alt_ja: '腰に手を当てて', alt_zh: '雙手叉腰', width: 1280, height: 1600 },
    { src: 'photos/ayaka-05.jpg', date: '2026-08-23', alt_ja: 'ミッキーのぬいぐるみと', alt_zh: '抱著米奇玩偶', width: 1280, height: 1600 },
    { src: 'photos/ayaka-06.jpg', date: '2026-08-23', alt_ja: '大きなぬいぐるみを抱えて', alt_zh: '抱著大玩偶', width: 1280, height: 1600 },
    { src: 'photos/ayaka-07.jpg', date: '2026-08-23', alt_ja: '満面の笑顔', alt_zh: '燦爛的笑容', width: 1280, height: 1600 },
    { src: 'photos/ayaka-08.jpg', date: '2026-08-23', alt_ja: 'クッションを持って', alt_zh: '拿著抱枕', width: 1280, height: 1600 },
    { src: 'photos/ayaka-09.jpg', date: '2026-08-23', alt_ja: '花の猫耳カチューシャ', alt_zh: '戴著花朵貓耳髮箍', width: 1280, height: 1600 }
  ],

  /* ---------- 應援留言 ----------
     ★ 以下都是範例文字，請換成自己的話。可以增減筆數。 */
  messages: [
    {
      ja: 'いつも素敵な歌とダンスをありがとう。AYAKAちゃんの笑顔を見ると、こちらまで元気になります。',
      zh: '謝謝妳總是帶來美好的歌聲與舞蹈。看到 AYAKA 的笑容，連我也跟著有了精神。'
    },
    {
      ja: '8月23日のイベントで見た笑顔が、今も忘れられません。また会える日を楽しみにしています。',
      zh: '8 月 23 日活動上看到的笑容，至今仍然難忘。期待再次見面的那一天。'
    },
    {
      ja: '無理をせず、体を大切にしてください。これからもずっと応援しています。',
      zh: '請不要勉強自己，好好照顧身體。今後也會一直支持妳。'
    },
    {
      ja: 'どんな時も自分らしく輝いているAYAKAちゃんが大好きです。',
      zh: '最喜歡無論何時都自在發光的 AYAKA。'
    }
  ],

  /* ---------- 關於這個網站 ---------- */
  about: {
    paragraphs: [
      {
        ja: 'このサイトは、ひとりのWithU（NiziUのファン）が作った非公式の応援サイトです。NiziUおよび所属事務所とは一切関係ありません。',
        zh: '這是一位 WithU（NiziU 粉絲）製作的非官方應援網站，與 NiziU 及其所屬公司無關。'
      },
      {
        ja: '掲載している写真はすべてサイト管理人が撮影したものです。無断転載はご遠慮ください。',
        zh: '網站上的照片皆由網站主人拍攝，請勿轉載。'
      }
    ]
  },

  /* ---------- 頁尾 ---------- */
  footer: {
    disclaimer: {
      ja: '非公式ファンサイトです。NiziUおよび所属事務所とは関係ありません。',
      zh: '非官方粉絲網站，與 NiziU 及其所屬公司無關。'
    },
    photoNotice: {
      ja: '写真はサイト管理人が撮影したものです。無断転載はご遠慮ください。',
      zh: '照片為網站主人拍攝，請勿轉載。'
    }
  }
};
