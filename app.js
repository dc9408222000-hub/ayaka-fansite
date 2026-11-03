/* =====================================================================
   app.js — 把 data.js 的內容畫到畫面上、語言切換、生日倒數、相簿燈箱。
   - 只用 textContent / createElement 寫入資料，不用 innerHTML
   - localStorage 的讀寫都包在 try/catch 裡
   - 不依賴任何第三方程式庫
   ===================================================================== */
(function () {
  'use strict';

  // 防止網站被別人用 iframe 嵌入（GitHub Pages 無法設定 X-Frame-Options，改用 JS 偵測後導回最上層）
  try {
    if (window.top !== window.self) { window.top.location.href = window.location.href; }
  } catch (e) { /* 跨網域的 top 無法讀取時會丟錯，忽略即可 */ }

  var DATA = window.SITE_DATA;
  var Countdown = window.AyakaCountdown;
  if (!DATA || !Countdown) { return; }

  var LANGS = ['ja', 'zh'];
  var HTML_LANG = { ja: 'ja', zh: 'zh-Hant' };
  var doc = document;

  var state = {
    lang: 'ja',
    photoIndex: -1,          // 燈箱目前顯示的照片；-1 表示關閉
    lastFocus: null,         // 開燈箱前的焦點元素，關閉後要還回去
    fallbackOpen: false,     // 瀏覽器不支援 dialog.showModal 時的備援模式
    birthdayPreview: window.location.hash === '#birthday-preview',
    countdownState: null
  };

  /* ---------- 小工具 ---------- */
  function t(obj) {
    if (obj == null) { return ''; }
    if (typeof obj === 'string') { return obj; }
    if (obj[state.lang] != null) { return String(obj[state.lang]); }
    return obj.ja != null ? String(obj.ja) : '';
  }
  function ui(key) { return t(DATA.ui[key]); }
  function fill(template, params) {
    return String(template).replace(/\{(\w+)\}/g, function (m, k) {
      return params && Object.prototype.hasOwnProperty.call(params, k) ? String(params[k]) : m;
    });
  }
  function el(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (text != null) { node.textContent = text; }
    return node;
  }
  function clear(node) { while (node.firstChild) { node.removeChild(node.firstChild); } }
  function qs(sel, root) { return (root || doc).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function photoAlt(photo) { return state.lang === 'zh' ? (photo.alt_zh || photo.alt_ja || '') : (photo.alt_ja || photo.alt_zh || ''); }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  /** 'YYYY-MM-DD' / 'YYYY-MM' / 'YYYY' → 日文或中文日期；null → 「日付：準備中／日期：待補」 */
  function formatDate(str) {
    if (!str) { return ui('dateUnknown'); }
    var parts = String(str).split('-').map(Number);
    var y = parts[0], m = parts[1], d = parts[2];
    if (state.lang === 'zh') {
      if (parts.length === 1) { return y + ' 年'; }
      if (parts.length === 2) { return y + ' 年 ' + m + ' 月'; }
      return y + ' 年 ' + m + ' 月 ' + d + ' 日';
    }
    if (parts.length === 1) { return y + '年'; }
    if (parts.length === 2) { return y + '年' + m + '月'; }
    return y + '年' + m + '月' + d + '日';
  }

  /* ---------- 語言：讀取／儲存（都包 try/catch） ---------- */
  function loadLang() {
    try {
      var saved = window.localStorage.getItem(DATA.site.storageKey);
      if (LANGS.indexOf(saved) !== -1) { return saved; }
    } catch (e) { /* 無痕模式或被封鎖時會失敗，忽略即可 */ }
    return LANGS.indexOf(DATA.site.defaultLang) !== -1 ? DATA.site.defaultLang : 'ja';
  }
  function saveLang(lang) {
    try { window.localStorage.setItem(DATA.site.storageKey, lang); } catch (e) { /* 忽略 */ }
  }

  /* ---------- 靜態文字：data-ui / data-hero / aria-label ---------- */
  function renderStaticText() {
    doc.documentElement.lang = HTML_LANG[state.lang];
    doc.title = t(DATA.site.title);
    var meta = qs('meta[name="description"]');
    if (meta) { meta.setAttribute('content', t(DATA.site.description)); }

    qsa('[data-ui]').forEach(function (node) {
      node.textContent = ui(node.getAttribute('data-ui'));
    });
    qsa('[data-ui-aria-label]').forEach(function (node) {
      node.setAttribute('aria-label', ui(node.getAttribute('data-ui-aria-label')));
    });
    qsa('[data-hero]').forEach(function (node) {
      var key = node.getAttribute('data-hero');
      var value = t(DATA.hero[key]);
      node.textContent = value;
      if (node.hasAttribute('hidden') || key === 'sloganNote') { node.hidden = !value; }
    });

    qsa('.lang-switch__btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === state.lang ? 'true' : 'false');
    });
  }

  /* ---------- 圖片：WebP 版本（<picture>）----------
     photos/ayaka-01.jpg → photos/ayaka-01-480.webp / -800.webp / -full.webp（scripts/make_images.py 產生） */
  function webpSrcset(photo) {
    var stem = String(photo.src).replace(/\.jpe?g$/i, '');
    var parts = [stem + '-480.webp 480w', stem + '-800.webp 800w'];
    if (photo.width) { parts.push(stem + '-full.webp ' + photo.width + 'w'); }
    return parts.join(', ');
  }
  function applyWebpSource(source, photo, sizes) {
    if (!source) { return; }
    if (DATA.site.webp) {
      source.setAttribute('type', 'image/webp');
      source.setAttribute('srcset', webpSrcset(photo));
      if (sizes) { source.setAttribute('sizes', sizes); }
    } else {
      source.removeAttribute('srcset');
      source.removeAttribute('sizes');
    }
  }
  var SIZES_GALLERY = '(min-width: 900px) 230px, (min-width: 700px) 30vw, 46vw';
  var SIZES_HERO = '(min-width: 720px) 460px, 92vw';
  var SIZES_LIGHTBOX = '100vw';

  /* ---------- 首頁主視覺 ---------- */
  function renderHero() {
    var img = qs('#hero-img');
    var photo = DATA.hero.photo;
    if (img && photo) {
      if (img.getAttribute('src') !== photo.src) { img.setAttribute('src', photo.src); }
      if (photo.width) { img.setAttribute('width', photo.width); }
      if (photo.height) { img.setAttribute('height', photo.height); }
      img.setAttribute('alt', photoAlt(photo));
      applyWebpSource(qs('#hero-source'), photo, SIZES_HERO);
    }
    var caption = qs('#hero-caption');
    if (caption) {
      caption.textContent = photo && photo.date ? fill(ui('photoCaptionDate'), { date: formatDate(photo.date) }) : '';
    }
  }

  /* ---------- 個人資料 ---------- */
  function renderProfile() {
    var list = qs('#profile-list');
    if (!list) { return; }
    clear(list);
    DATA.profile.forEach(function (row) {
      var wrap = el('div', 'profile__row' + (row.value == null ? ' profile__row--placeholder' : ''));
      wrap.appendChild(el('dt', 'profile__label', t(row.label)));
      var dd = el('dd', 'profile__value');
      if (row.value == null) {
        dd.appendChild(el('span', 'profile__value--placeholder', ui('placeholder')));
      } else {
        dd.appendChild(doc.createTextNode(t(row.value)));
        if (row.showAge && state.countdownState) {
          var age = state.countdownState.age;
          var sep = state.lang === 'zh' ? '\u00a0' : '';
          dd.appendChild(el('span', 'profile__age', '（' + age + sep + ui('ageSuffix') + '）'));
        }
      }
      wrap.appendChild(dd);
      list.appendChild(wrap);
    });
  }

  /* ---------- 生日倒數 ---------- */
  function computeState() {
    var now = Date.now();
    var birthday = DATA.site.birthday;
    if (state.birthdayPreview) {
      // 預覽模式：假裝現在是今年生日當天的中午（用來檢查版面）
      var jstNow = Countdown.jstParts(now);
      now = Countdown.jstMidnightMs(jstNow.year, birthday.month, birthday.day) + 12 * 3600 * 1000;
    }
    return Countdown.computeBirthdayState(now, birthday);
  }

  function renderBirthdayText() {
    var s = state.countdownState;
    if (!s) { return; }
    var lead = qs('#birthday-lead');
    var until = qs('#birthday-until');
    var greeting = qs('#birthday-greeting');
    var greetingLead = qs('#birthday-greeting-lead');
    if (lead) { lead.textContent = ui('birthdayLead'); }
    if (until) { until.textContent = fill(ui('birthdayUntil'), { age: s.nextAge }); }
    if (greeting) { greeting.textContent = ui('birthdayToday'); }
    if (greetingLead) { greetingLead.textContent = fill(ui('birthdayTodayLead'), { age: s.age }); }
    var countdown = qs('#countdown');
    if (countdown) { countdown.setAttribute('aria-label', ui('countdownLabel')); }
    var mark = qs('#birthday-mark');
    if (mark) { mark.textContent = DATA.site.birthday.month + '.' + DATA.site.birthday.day; }
  }

  function tick() {
    var s = computeState();
    var wasBirthday = state.countdownState ? state.countdownState.isBirthday : null;
    var prevAge = state.countdownState ? state.countdownState.age : null;
    state.countdownState = s;

    var box = qs('#birthday-countdown');
    var today = qs('#birthday-today');
    if (box) { box.hidden = s.isBirthday; }
    if (today) { today.hidden = !s.isBirthday; }

    if (!s.isBirthday) {
      var nums = { days: s.days, hours: pad2(s.hours), minutes: pad2(s.minutes), seconds: pad2(s.seconds) };
      qsa('#countdown [data-unit]').forEach(function (node) {
        var v = String(nums[node.getAttribute('data-unit')]);
        if (node.textContent !== v) { node.textContent = v; }
      });
    }
    // 跨過生日或年齡變了（例如頁面開著跨日）就更新相關文字
    if (wasBirthday !== s.isBirthday || prevAge !== s.age) {
      renderBirthdayText();
      renderProfile();
    }
  }

  function startClock() {
    tick();
    // 每 250ms 檢查一次、只在數字真的變了才改 DOM，秒數才不會因為主執行緒忙碌而跳格
    window.setInterval(tick, 250);
    doc.addEventListener('visibilitychange', function () {
      if (doc.visibilityState === 'visible') { tick(); }
    });
  }

  /* ---------- 年表 ---------- */
  function renderTimeline() {
    var list = qs('#timeline-list');
    if (!list) { return; }
    clear(list);
    DATA.timeline.forEach(function (item) {
      var li = el('li', 'timeline__item');
      if (item.placeholder) {
        li.className += ' timeline__item--placeholder';
        li.appendChild(el('p', 'timeline__placeholder', ui('timelinePlaceholder')));
        list.appendChild(li);
        return;
      }
      var date = el('time', 'timeline__date', formatDate(item.date));
      if (item.date) { date.setAttribute('datetime', item.date); } else { date.className += ' timeline__date--unknown'; }
      li.appendChild(date);
      li.appendChild(el('h3', 'timeline__title', t(item.title)));
      var note = t(item.note);
      if (note) { li.appendChild(el('p', 'timeline__note', note)); }
      list.appendChild(li);
    });
  }

  /* ---------- 相簿（格子只建立一次，切換語言時只更新文字） ---------- */
  function buildGallery() {
    var grid = qs('#gallery-grid');
    if (!grid) { return; }
    clear(grid);
    DATA.photos.forEach(function (photo, index) {
      var li = el('li', 'gallery__item');
      var btn = el('button', 'gallery__btn');
      btn.type = 'button';
      btn.setAttribute('data-index', String(index));
      var frame = el('div', 'gallery__frame');
      var picture = el('picture');
      var source = el('source');
      applyWebpSource(source, photo, SIZES_GALLERY);
      var img = el('img', 'gallery__img');
      img.setAttribute('src', photo.src);
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (photo.width) { img.setAttribute('width', photo.width); }
      if (photo.height) { img.setAttribute('height', photo.height); }
      img.setAttribute('alt', '');
      if (DATA.site.webp) { picture.appendChild(source); }
      picture.appendChild(img);
      frame.appendChild(picture);
      btn.appendChild(frame);
      btn.setAttribute('aria-describedby', 'gallery-hint');
      btn.addEventListener('click', function () { openLightbox(index, btn); });
      li.appendChild(btn);
      var caption = el('p', 'gallery__caption');
      caption.appendChild(el('span', 'gallery__index', pad2(index + 1)));
      caption.appendChild(el('span', 'gallery__caption-text'));
      caption.appendChild(el('span', 'gallery__date'));
      li.appendChild(caption);
      grid.appendChild(li);
    });
  }

  function renderGalleryText() {
    var hint = qs('#gallery-hint');
    if (hint) { hint.textContent = ui('galleryOpen'); }
    qsa('#gallery-grid .gallery__item').forEach(function (item) {
      var btn = qs('.gallery__btn', item);
      var photo = DATA.photos[Number(btn.getAttribute('data-index'))];
      if (!photo) { return; }
      var alt = photoAlt(photo);
      var dateText = photo.date ? fill(ui('photoCaptionDate'), { date: formatDate(photo.date) }) : '';
      qs('.gallery__img', btn).setAttribute('alt', alt);   // 按鈕的無障礙名稱 = 圖片 alt
      qs('.gallery__caption-text', item).textContent = alt;
      qs('.gallery__date', item).textContent = dateText;
    });
  }

  /* ---------- 燈箱 ---------- */
  var lightbox = qs('#lightbox');
  var lbImg = qs('#lightbox-img');

  function showPhoto(index) {
    var total = DATA.photos.length;
    if (!total) { return; }
    index = ((index % total) + total) % total;   // 循環
    state.photoIndex = index;
    var photo = DATA.photos[index];
    applyWebpSource(qs('#lightbox-source'), photo, SIZES_LIGHTBOX);
    if (lbImg.getAttribute('src') !== photo.src) { lbImg.setAttribute('src', photo.src); }
    if (photo.width) { lbImg.setAttribute('width', photo.width); }
    if (photo.height) { lbImg.setAttribute('height', photo.height); }
    lbImg.setAttribute('alt', photoAlt(photo));
    qs('#lightbox-caption').textContent = photoAlt(photo);
    qs('#lightbox-date').textContent = photo.date ? fill(ui('photoCaptionDate'), { date: formatDate(photo.date) }) : '';
    qs('#lightbox-counter').textContent = fill(ui('lightboxCounter'), { current: index + 1, total: total });
    // 先把前後兩張抓進快取，切換時才不會等（支援 WebP 的瀏覽器會抓 WebP）
    [index + 1, index - 1].forEach(function (i) {
      var p = DATA.photos[((i % total) + total) % total];
      if (!p || p.src === photo.src) { return; }
      var pre = new Image();
      if (DATA.site.webp && supportsWebp()) { pre.src = String(p.src).replace(/\.jpe?g$/i, '') + '-full.webp'; }
      else { pre.src = p.src; }
    });
  }

  var webpSupport = null;
  function supportsWebp() {
    if (webpSupport === null) {
      try {
        var c = doc.createElement('canvas');
        webpSupport = !!(c.getContext && c.getContext('2d')) && c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      } catch (e) { webpSupport = false; }
    }
    return webpSupport;
  }

  function openLightbox(index, trigger) {
    if (!lightbox) { return; }
    state.lastFocus = trigger || doc.activeElement;
    showPhoto(index);
    doc.body.classList.add('is-locked');
    if (typeof lightbox.showModal === 'function') {
      if (!lightbox.open) { lightbox.showModal(); }
    } else {
      state.fallbackOpen = true;
      lightbox.setAttribute('open', '');
    }
    lightbox.focus();   // 焦點放在 dialog 本身：會唸出標籤，也不會在點按時出現焦點框
  }

  function closeLightbox() {
    if (!lightbox) { return; }
    if (state.fallbackOpen) {
      lightbox.removeAttribute('open');
      state.fallbackOpen = false;
      onLightboxClosed();
    } else if (lightbox.open) {
      lightbox.close();   // 會觸發 close 事件 → onLightboxClosed
    }
  }

  function onLightboxClosed() {
    doc.body.classList.remove('is-locked');
    state.photoIndex = -1;
    var back = state.lastFocus;
    state.lastFocus = null;
    if (back && typeof back.focus === 'function' && doc.contains(back)) { back.focus(); }
  }

  function stepPhoto(delta) {
    if (state.photoIndex < 0) { return; }
    showPhoto(state.photoIndex + delta);
  }

  function setupLightbox() {
    if (!lightbox) { return; }
    lightbox.addEventListener('close', onLightboxClosed);
    qs('#lightbox-close').addEventListener('click', closeLightbox);
    qs('#lightbox-prev').addEventListener('click', function () { stepPhoto(-1); });
    qs('#lightbox-next').addEventListener('click', function () { stepPhoto(1); });

    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepPhoto(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPhoto(-1); }
      else if (e.key === 'Escape' && state.fallbackOpen) { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'Tab' && state.fallbackOpen) { trapFocus(e); }
    });

    // 點在照片以外的暗色區域就關閉
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === qs('#lightbox-stage') || e.target.classList.contains('lightbox__figure')) {
        closeLightbox();
      }
    });

    // 觸控滑動切換
    var touchX = null, touchY = null;
    var stage = qs('#lightbox-stage');
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { touchX = null; return; }
      touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (touchX == null || !e.changedTouches.length) { return; }
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      touchX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) { stepPhoto(dx < 0 ? 1 : -1); }
    }, { passive: true });
  }

  function trapFocus(e) {
    var focusables = qsa('button, [href], [tabindex]:not([tabindex="-1"])', lightbox).filter(function (n) { return !n.disabled; });
    if (!focusables.length) { return; }
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- 應援留言、關於、頁尾 ---------- */
  function renderMessages() {
    var list = qs('#messages-list');
    if (!list) { return; }
    clear(list);
    DATA.messages.forEach(function (msg) {
      var li = el('li', 'message');
      li.appendChild(el('p', 'message__text', t(msg)));
      li.appendChild(el('p', 'message__from', ui('messageFrom')));
      list.appendChild(li);
    });
  }

  function renderAbout() {
    var box = qs('#about-text');
    if (!box) { return; }
    clear(box);
    (DATA.about.paragraphs || []).forEach(function (p) { box.appendChild(el('p', null, t(p))); });
  }

  function renderFooter() {
    var d = qs('#footer-disclaimer'), p = qs('#footer-photo'), u = qs('#footer-updated');
    if (d) { d.textContent = t(DATA.footer.disclaimer); }
    if (p) { p.textContent = t(DATA.footer.photoNotice); }
    if (u) { u.textContent = fill(ui('footerUpdated'), { date: formatDate(DATA.site.lastUpdated) }); }
  }

  /* ---------- 全部重畫（切換語言時） ---------- */
  function renderAll() {
    renderStaticText();
    renderHero();
    renderProfile();
    renderBirthdayText();
    renderTimeline();
    renderGalleryText();
    if (state.photoIndex >= 0) { showPhoto(state.photoIndex); }
    renderMessages();
    renderAbout();
    renderFooter();
  }

  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1 || lang === state.lang) { return; }
    state.lang = lang;
    saveLang(lang);
    renderAll();
  }

  /* ---------- 導覽列：標示目前所在的區塊 ---------- */
  function setupNavHighlight() {
    if (!('IntersectionObserver' in window)) { return; }
    var links = qsa('.site-nav__list a[href^="#"]');
    var current = null;
    function setCurrent(id) {
      if (id === current) { return; }
      current = id;
      links.forEach(function (link) {
        var on = link.getAttribute('href') === '#' + id;
        if (on) {
          link.setAttribute('aria-current', 'true');
          if (typeof link.scrollIntoView === 'function') {
            try { link.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'auto' }); } catch (e) { /* 舊瀏覽器 */ }
          }
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { setCurrent(entry.target.id); } });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    links.forEach(function (link) {
      var section = doc.getElementById(link.getAttribute('href').slice(1));
      if (section) { observer.observe(section); }
    });
  }

  function setupLangSwitch() {
    qsa('.lang-switch__btn').forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
  }

  /* ---------- 啟動 ---------- */
  function init() {
    state.lang = loadLang();
    state.countdownState = computeState();
    buildGallery();
    setupLightbox();
    setupLangSwitch();
    setupNavHighlight();
    renderAll();
    startClock();
    window.addEventListener('hashchange', function () {
      var preview = window.location.hash === '#birthday-preview';
      if (preview !== state.birthdayPreview) { state.birthdayPreview = preview; tick(); }
    });
  }

  if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', init); } else { init(); }
}());
