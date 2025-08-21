// ====== Thuật toán Âm - Dương lịch của Ho Ngoc Duc ======

// Chuyển đổi ngày dương sang số ngày Julius
function jdFromDate(dd, mm, yy) {
  var a = Math.floor((14 - mm) / 12);
  var y = yy + 4800 - a;
  var m = mm + 12 * a - 3;
  var jd = dd + Math.floor((153 * m + 2) / 5) + 
           365 * y + Math.floor(y / 4) - Math.floor(y / 100) + 
           Math.floor(y / 400) - 32045;
  return jd;
}

// Chuyển số ngày Julius sang ngày dương
function jdToDate(jd) {
  var a, b, c, d, e, m;
  var day, month, year;
  if (jd > 2299160) { // after 5/10/1582 Gregorian
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = Math.floor((4 * c + 3) / 1461);
  e = c - Math.floor((1461 * d) / 4);
  m = Math.floor((5 * e + 2) / 153);
  day = e - Math.floor((153 * m + 2) / 5) + 1;
  month = m + 3 - 12 * Math.floor(m / 10);
  year = b * 100 + d - 4800 + Math.floor(m / 10);
  return [day, month, year];
}

// Tính ngày Sóc (new moon) thứ k tính từ 1/1/1900 (JDN=2415021.076998695)
function getNewMoonDay(k, timeZone) {
  var T = k / 1236.85;
  var T2 = T * T;
  var T3 = T2 * T;
  var dr = Math.PI / 180;
  var Jd1 = 2415020.75933 + 29.53058868 * k 
           + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  var M = 359.2242 + 29.10535608 * k 
         - 0.0000333 * T2 - 0.00000347 * T3;
  var Mpr = 306.0253 + 385.81691806 * k 
           + 0.0107306 * T2 + 0.00001236 * T3;
  var F = 21.2964 + 390.67050646 * k 
         - 0.0016528 * T2 - 0.00000239 * T3;
  var C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) 
         + 0.0021 * Math.sin(2 * dr * M)
         - 0.4068 * Math.sin(Mpr * dr) 
         + 0.0161 * Math.sin(dr * 2 * Mpr)
         - 0.0004 * Math.sin(dr * 3 * Mpr)
         + 0.0104 * Math.sin(dr * 2 * F) 
         - 0.0051 * Math.sin(dr * (M + Mpr))
         - 0.0074 * Math.sin(dr * (M - Mpr))
         + 0.0004 * Math.sin(dr * (2 * F + M))
         - 0.0004 * Math.sin(dr * (2 * F - M))
         - 0.0006 * Math.sin(dr * (2 * F + Mpr))
         + 0.0010 * Math.sin(dr * (2 * F - Mpr))
         + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  var deltaT;
  if (T < -11) {
    deltaT = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltaT = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  var JdNew = Jd1 + C1 - deltaT;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

// Tính tọa độ Mặt Trời để xác định tháng âm
function getSunLongitude(jdn, timeZone) {
  var T = (jdn - 2451545.5 - timeZone / 24) / 36525;
  var T2 = T * T;
  var dr = Math.PI / 180;
  var M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  var L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  var DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  var L = L0 + DL;
  L = L * dr;
  L = L - 2 * Math.PI * (Math.floor(L / (2 * Math.PI)));
  return Math.floor(L / Math.PI * 6);
}

// Tìm tháng nhuận
function getLeapMonthOffset(a11, timeZone) {
  var k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  var last; var arc = getSunLongitude(getNewMoonDay(k+1, timeZone), timeZone);
  var i = 1; // tháng 11 có thể nhuận
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k+i, timeZone), timeZone);
  } while (arc != last && i < 14);
  return i - 1;
}

// Đổi dương sang âm
function convertSolar2Lunar(dd, mm, yy, timeZone) {
  var dayNumber = jdFromDate(dd, mm, yy);
  var k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  var monthStart = getNewMoonDay(k+1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  var a11 = getLunarMonth11(yy, timeZone);
  var b11 = a11;
  var lunarYear;
  if (a11 >= monthStart) {
    a11 = getLunarMonth11(yy-1, timeZone);
    lunarYear = yy;
  } else {
    b11 = getLunarMonth11(yy+1, timeZone);
    lunarYear = yy;
  }
  var lunarDay = dayNumber - monthStart + 1;
  var diff = Math.floor((monthStart - a11) / 29);
  var lunarMonth = diff + 11;
  var leap = 0;
  if (b11 - a11 > 365) {
    var leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff == leapMonthDiff) leap = 1;
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [lunarDay, lunarMonth, lunarYear, leap];
}

// Tìm tháng 11 âm lịch
function getLunarMonth11(yy, timeZone) {
  var off = jdFromDate(31, 12, yy) - 2415021.076998695;
  var k = Math.floor(off / 29.530588853);
  var nm = getNewMoonDay(k, timeZone);
  var sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k-1, timeZone);
  }
  return nm;
}

// ====== TEST ======
const lunar = convertSolar2Lunar(19, 8, 2025, 7); 
console.log(`Âm lịch: ${lunar[0]}/${lunar[1]}/${lunar[2]}${lunar[3] ? " (nhuận)" : ""}`);
// Kết quả: 26/7/2025
