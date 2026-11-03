// data.js 的資料檢查：node --test
// 確認每段文字都有日文與中文、照片檔案存在、日期格式正確、{佔位符} 沒有漏掉。
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'data.js'));
const DATA = global.window.SITE_DATA;

/** 走訪整個資料物件，收集所有 { ja, zh } 文字物件 */
function collectPairs(value, p, out) {
  if (!value || typeof value !== 'object') { return out; }
  if (Object.prototype.hasOwnProperty.call(value, 'ja') || Object.prototype.hasOwnProperty.call(value, 'zh')) {
    out.push({ path: p, value });
    return out;
  }
  for (const [k, v] of Object.entries(value)) {
    collectPairs(v, p ? `${p}.${k}` : k, out);
  }
  return out;
}

const EMPTY_ALLOWED = [/^hero\.sloganNote$/, /^timeline\.\d+\.note$/, /^ui\.messageFrom$/];

test('每段文字都同時有日文（ja）與中文（zh）', () => {
  const pairs = collectPairs(DATA, '', []);
  assert.ok(pairs.length > 40, '文字數量異常：' + pairs.length);
  const missing = pairs.filter(({ value }) => typeof value.ja !== 'string' || typeof value.zh !== 'string');
  assert.deepEqual(missing.map((m) => m.path), []);
});

test('除了允許留白的欄位，文字不可以是空字串', () => {
  const pairs = collectPairs(DATA, '', []);
  const empty = pairs
    .filter(({ path: p }) => !EMPTY_ALLOWED.some((re) => re.test(p)))
    .filter(({ value }) => !value.ja.trim() || !value.zh.trim());
  assert.deepEqual(empty.map((m) => m.path), []);
});

test('介面文字的 {佔位符} 都在', () => {
  const need = {
    birthdayUntil: ['{age}'], birthdayTodayLead: ['{age}'],
    lightboxCounter: ['{current}', '{total}'], footerUpdated: ['{date}'], photoCaptionDate: ['{date}'],
  };
  for (const [key, tokens] of Object.entries(need)) {
    for (const lang of ['ja', 'zh']) {
      for (const token of tokens) {
        assert.ok(DATA.ui[key][lang].includes(token), `ui.${key}.${lang} 缺少 ${token}`);
      }
    }
  }
});

test('相簿與主視覺的照片檔案都存在，且有 alt 與尺寸', () => {
  const photos = [DATA.hero.photo, ...DATA.photos];
  for (const photo of photos) {
    const file = path.join(ROOT, photo.src);
    assert.ok(fs.existsSync(file), `找不到 ${photo.src}`);
    assert.ok(photo.alt_ja && photo.alt_zh, `${photo.src} 缺少 alt_ja / alt_zh`);
    assert.equal(typeof photo.width, 'number');
    assert.equal(typeof photo.height, 'number');
    assert.match(photo.date || '', /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(DATA.photos.length, 9);
});

test('site.webp 為 true 時，每張照片的 WebP 版本都存在（scripts/make_images.py）', { skip: !DATA.site.webp }, () => {
  const photos = [DATA.hero.photo, ...DATA.photos];
  for (const photo of photos) {
    const stem = photo.src.replace(/\.jpe?g$/i, '');
    for (const suffix of ['-480.webp', '-800.webp', '-full.webp']) {
      assert.ok(fs.existsSync(path.join(ROOT, stem + suffix)), `找不到 ${stem}${suffix}`);
    }
  }
});

test('年表日期格式為 YYYY、YYYY-MM、YYYY-MM-DD 或 null', () => {
  for (const item of DATA.timeline) {
    if (item.placeholder) { continue; }
    assert.ok(item.date === null || /^\d{4}(-\d{2}){0,2}$/.test(item.date), `日期格式錯誤：${item.date}`);
    assert.ok(item.title && item.title.ja && item.title.zh, '年表項目缺少標題');
  }
});

test('基本設定合理', () => {
  assert.ok(['ja', 'zh'].includes(DATA.site.defaultLang));
  assert.match(DATA.site.lastUpdated, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(Object.keys(DATA.site.birthday).sort(), ['day', 'month', 'year']);
  assert.ok(DATA.messages.length >= 3 && DATA.messages.length <= 5, '應援留言建議 3～5 則');
  assert.ok(DATA.profile.some((row) => row.showAge), '生日欄位要有 showAge');
});
