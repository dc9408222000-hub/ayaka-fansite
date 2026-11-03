/* =====================================================================
   countdown.js — 生日倒數的純計算邏輯（以日本時間 JST, UTC+9 為準）。
   瀏覽器裡會掛在 window.AyakaCountdown；在 Node 裡可以 require() 來測試。
   不依賴任何 DOM，也不依賴執行環境的時區。
   ===================================================================== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AyakaCountdown = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var JST_OFFSET_MS = 9 * 60 * 60 * 1000; // 日本沒有夏令時間，固定 +9 小時
  var DAY_MS = 24 * 60 * 60 * 1000;

  /** 把某個時刻（毫秒）換成日本時間的年月日時分秒。 */
  function jstParts(nowMs) {
    var d = new Date(nowMs + JST_OFFSET_MS);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds()
    };
  }

  /** 日本時間某一天的 00:00:00 對應的時刻（毫秒）。 */
  function jstMidnightMs(year, month, day) {
    return Date.UTC(year, month - 1, day) - JST_OFFSET_MS;
  }

  /**
   * 計算生日倒數狀態。
   * @param {number} nowMs  現在時刻（Date.now()）
   * @param {{year:number, month:number, day:number}} birthday  生日（year 是出生年）
   * @returns {{
   *   isBirthday:boolean, targetMs:number, remainingMs:number,
   *   days:number, hours:number, minutes:number, seconds:number,
   *   age:number, nextAge:number, jst:object
   * }}
   */
  function computeBirthdayState(nowMs, birthday) {
    var month = birthday.month;
    var day = birthday.day;
    var birthYear = birthday.year;
    var now = jstParts(nowMs);

    var isBirthday = now.month === month && now.day === day;

    // 今年的生日 00:00（JST）已經過了，而且今天不是生日 → 倒數到明年
    var targetYear = now.year;
    if (!isBirthday && nowMs >= jstMidnightMs(now.year, month, day)) {
      targetYear = now.year + 1;
    }
    var targetMs = jstMidnightMs(targetYear, month, day);
    var remainingMs = Math.max(0, targetMs - nowMs);

    var days = Math.floor(remainingMs / DAY_MS);
    var rest = remainingMs - days * DAY_MS;
    var hours = Math.floor(rest / 3600000);
    rest -= hours * 3600000;
    var minutes = Math.floor(rest / 60000);
    rest -= minutes * 60000;
    var seconds = Math.floor(rest / 1000);

    // 目前年齡（日本時間）：生日還沒到就減一歲
    var beforeBirthdayThisYear = now.month < month || (now.month === month && now.day < day);
    var age = now.year - birthYear - (beforeBirthdayThisYear ? 1 : 0);
    var nextAge = isBirthday ? age : targetYear - birthYear;

    return {
      isBirthday: isBirthday,
      targetMs: targetMs,
      remainingMs: remainingMs,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      age: age,
      nextAge: nextAge,
      jst: now
    };
  }

  return {
    JST_OFFSET_MS: JST_OFFSET_MS,
    jstParts: jstParts,
    jstMidnightMs: jstMidnightMs,
    computeBirthdayState: computeBirthdayState
  };
}));
