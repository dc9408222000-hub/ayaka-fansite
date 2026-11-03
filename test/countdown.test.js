// 生日倒數邏輯測試：node --test test/
// 所有時刻都用 Date.UTC 寫成「日本時間減 9 小時」，和執行環境的時區無關。
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { computeBirthdayState, jstParts, jstMidnightMs, JST_OFFSET_MS } = require('../countdown.js');

const BIRTHDAY = { year: 2003, month: 6, day: 20 };
// 日本時間 → 毫秒
const jst = (y, m, d, hh = 0, mm = 0, ss = 0) => Date.UTC(y, m - 1, d, hh, mm, ss) - JST_OFFSET_MS;

test('jstParts 會換算成日本時間的日曆欄位', () => {
  const p = jstParts(Date.UTC(2026, 5, 19, 15, 0, 0)); // UTC 15:00 = JST 翌日 00:00
  assert.deepEqual(p, { year: 2026, month: 6, day: 20, hour: 0, minute: 0, second: 0 });
});

test('jstMidnightMs 與 jstParts 互為反函數', () => {
  const ms = jstMidnightMs(2026, 6, 20);
  assert.deepEqual(jstParts(ms), { year: 2026, month: 6, day: 20, hour: 0, minute: 0, second: 0 });
});

test('6/19 23:59:59 JST：還不是生日，剩 1 秒', () => {
  const s = computeBirthdayState(jst(2026, 6, 19, 23, 59, 59), BIRTHDAY);
  assert.equal(s.isBirthday, false);
  assert.equal(s.remainingMs, 1000);
  assert.deepEqual([s.days, s.hours, s.minutes, s.seconds], [0, 0, 0, 1]);
  assert.equal(s.age, 22);
  assert.equal(s.nextAge, 23);
  assert.equal(s.targetMs, jst(2026, 6, 20));
});

test('6/20 00:00:00 JST：生日當天，顯示祝福', () => {
  const s = computeBirthdayState(jst(2026, 6, 20, 0, 0, 0), BIRTHDAY);
  assert.equal(s.isBirthday, true);
  assert.equal(s.remainingMs, 0);
  assert.equal(s.age, 23);
  assert.equal(s.nextAge, 23);
});

test('6/20 23:59:59 JST：整天都算生日', () => {
  const s = computeBirthdayState(jst(2026, 6, 20, 23, 59, 59), BIRTHDAY);
  assert.equal(s.isBirthday, true);
  assert.equal(s.age, 23);
});

test('6/21 00:00:00 JST：倒數到明年的 6/20', () => {
  const s = computeBirthdayState(jst(2026, 6, 21, 0, 0, 0), BIRTHDAY);
  assert.equal(s.isBirthday, false);
  assert.equal(s.targetMs, jst(2027, 6, 20));
  assert.equal(s.days, 364);
  assert.deepEqual([s.hours, s.minutes, s.seconds], [0, 0, 0]);
  assert.equal(s.age, 23);
  assert.equal(s.nextAge, 24);
});

test('跨閏年（2027/6/21 → 2028/6/20）會是 365 天', () => {
  const s = computeBirthdayState(jst(2027, 6, 21, 0, 0, 0), BIRTHDAY);
  assert.equal(s.days, 365);
  assert.equal(s.targetMs, jst(2028, 6, 20));
});

test('年初（1/1 JST）倒數到同一年的 6/20', () => {
  const s = computeBirthdayState(jst(2026, 1, 1, 12, 30, 0), BIRTHDAY);
  assert.equal(s.targetMs, jst(2026, 6, 20));
  assert.equal(s.days, 169);
  assert.equal(s.hours, 11);
  assert.equal(s.minutes, 30);
  assert.equal(s.age, 22);
});

test('計算只看日本時間：UTC 6/19 15:00 已經是 JST 6/20', () => {
  const s = computeBirthdayState(Date.UTC(2026, 5, 19, 15, 0, 0), BIRTHDAY);
  assert.equal(s.isBirthday, true);
});

test('計算只看日本時間：UTC 6/20 15:00 已經是 JST 6/21，不再是生日', () => {
  const s = computeBirthdayState(Date.UTC(2026, 5, 20, 15, 0, 0), BIRTHDAY);
  assert.equal(s.isBirthday, false);
  assert.equal(s.targetMs, jst(2027, 6, 20));
});
