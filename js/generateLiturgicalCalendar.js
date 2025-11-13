function toUTC(y, m, d) {
  return new Date(y, m - 1, d);
}

function formatDMY(d) {
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

function dateToYMD(date = new Date()) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

function ymdToDate(ymd) {
  return toUTC(ymd.year, ymd.month, ymd.day);
}

function addDaysDate(dateObj, n) {
  const d = new Date(dateObj.getTime());
  d.setDate(d.getDate() + n);
  return d;
}

function minusDaysDate(dateObj, n) {
  let d = new Date(dateObj);

  return d;
}
// n is number of days to add
function addDaysYMD(ymd, n) {
  const dt = addDaysDate(ymdToDate(ymd), n);
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
  };
}

function minusDaysYMD(ymd, n) {
  let dt = ymd;
  dt.setDate(dt.getDate() - n);
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
  };
}

function dowNameViFromDate(dateObj) {
  const names = [
    "CN",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  return names[dateObj.getDay()];
}

/* ============================
       Easter (Meeus-Jones-Butcher)
       valid 1583-4099
       ============================ */
function easterGregorian(year) {
  if (!Number.isInteger(year)) throw new Error("Year must be integer");
  if (year < 1583 || year > 4099) throw new Error("Year must be 1583..4099");
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  const month = Math.floor(n / 31);
  const day = (n % 31) + 1;
  return {
    year,
    month,
    day,
  };
}

function firstSundayOfAdvent(prevYear) {
  // Simpler: test dates Nov27..Dec3
  for (let d = 27; d <= 31; d++) {
    const dt = toUTC(prevYear, 11, d); // month 11 = November
    if (dt.getDay() === 0)
      return {
        year: prevYear,
        month: 11,
        day: d,
      };
  }
  for (let d = 1; d <= 3; d++) {
    const dt = toUTC(prevYear, 12, d); // December
    if (dt.getDay() === 0)
      return {
        year: prevYear,
        month: 12,
        day: d,
      };
  }
  // fallback: find Sunday on or after Nov27
  let test = toUTC(prevYear, 11, 27);
  while (test.getMonth() === 11 && test.getDate() <= 31) {
    if (test.getDay() === 0)
      return {
        year: test.getFullYear(),
        month: test.getMonth() + 1,
        day: test.getDate(),
      };
    test = addDaysDate(test, 1);
  }
  // final fallback: return Nov27
  return {
    year: prevYear,
    month: 11,
    day: 27,
  };
}

// Given Easter YMD, compute standard movable feasts (as YMD objects)
function computeMovableFeasts(easter) {
  // Offsets in days relative to Easter
  const offsets = [
    {
      name: "Lễ Tro",
      offset: -46,
    },
    {
      name: "CN Lễ Lá (CN Tuần Thánh)",
      offset: -7,
    },
    {
      name: "Thứ Năm Tuần Thánh",
      offset: -3,
    },
    {
      name: "Thứ Sáu Tuần Thánh",
      offset: -2,
    },
    {
      name: "Thứ Bảy Tuần Thánh",
      offset: -1,
    },
    {
      name: "Lễ Phục Sinh",
      offset: 0,
    },
    // Lễ Thăng Thiên: per VN -> move to nearest Sunday after 39 -> +42
    {
      name: "Lễ Thăng Thiên (Chuyển về CN)",
      offset: 42,
    },
    {
      name: "Chúa Thánh Thần Hiện Xuống (Lễ Hiện Xuống)",
      offset: 49,
    },
    {
      name: "Chúa Ba Ngôi",
      offset: 56,
    },
    {
      name: "Lễ Mình Máu Thánh Chúa",
      offset: 60,
    },
    {
      name: "Thánh Tâm Chúa Giêsu",
      offset: 68,
    },
  ];
  return offsets.map((o) => {
    const d = addDaysYMD(easter, o.offset);
    return {
      name: o.name,
      y: d.year,
      m: d.month,
      d: d.day,
    };
  });
}

function holyFamilySunday(year) {
  // find Sunday on or after Dec 26
  for (let d = 26; d <= 31; d++) {
    const dt = toUTC(year, 12, d);
    if (dt.getDay() === 0) {
      return {
        year,
        month: 12,
        day: d,
      };
    }
  }
  // fallback: 30/12 nếu không có CN
  return {
    year,
    month: 12,
    day: 30,
  };
}

// Epiphany: usual practice — celebrate on the Sunday between Jan 2 and Jan 8 (inclusive).
function epiphanySunday(year) {
  // find Sunday between Jan 2 and Jan 8 of calendar year
  for (let d = 2; d <= 8; d++) {
    const dt = toUTC(year, 1, d);
    if (dt.getDay() === 0)
      return {
        year,
        month: 1,
        day: d,
      };
  }
  // fallback: Jan6
  return {
    year,
    month: 1,
    day: 6,
  };
}

// Baptism of the Lord: the Sunday after Epiphany (or Jan 13 if Epiphany celebrated earlier) — we take the Sunday after Epiphany.
function baptismOfTheLord(epiphany) {
  const dt = toUTC(epiphany.year, epiphany.month, epiphany.day);
  const nextSun = addDaysDate(dt, 7);
  return {
    year: nextSun.getFullYear(),
    month: nextSun.getMonth() + 1,
    day: nextSun.getDate(),
  };
}

// Helper: next Sunday on or after date
function nextSundayOnOrAfter(ymd) {
  let dt = toUTC(ymd.year, ymd.month, ymd.day);
  while (dt.getDay() !== 0) {
    dt = addDaysDate(dt, 1);
  }
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
  };
}
// Helper: previous Sunday on or before date
function prevSundayOnOrBefore(ymd) {
  let dt = toUTC(ymd.year, ymd.month, ymd.day);
  while (dt.getDay() !== 0) {
    dt = addDaysDate(dt, -1);
  }
  return {
    year: dt.getFullYear(),
    month: dt.getMonth() + 1,
    day: dt.getDate(),
  };
}

/* ============================
       Build full liturgical year sequence
       Input: civil year (year of Easter)
       Output: array of items {season, sundayName, weekNumber, y,m,d, label}
       ============================ */
function buildLiturgicalYearForEasterYear(easterYear) {
  // The liturgical year that contains EasterYear begins on the First Sunday of Advent of (easterYear - 1)
  const prevYear = easterYear - 1;
  const adventStart = firstSundayOfAdvent(prevYear); // CN I Mùa Vọng
  // We'll produce list from adventStart (inclusive) up to day before next adventStart (i.e., next year's first advent)
  const nextAdventStart = firstSundayOfAdvent(easterYear);

  console.log(nextAdventStart);
  // Easter (civil)
  const easter = easterGregorian(easterYear); // {year,month,day}
  const easterDate = toUTC(easter.year, easter.month, easter.day);

  // Fixed feasts in Christmas season
  const christmas = {
    year: prevYear + 1,
    month: 12,
    day: 25,
  }; // Dec 25 of prevYear+1? Wait: careful
  // Actually christmas belongs to calendar year prevYear+1? Example: if easterYear=2026, prevYear=2025, adventStart in 2025 Nov.., Christmas is Dec 25, 2025
  const christmasYMD = {
    year: prevYear,
    month: 12,
    day: 25,
  };
  // Correction: adventStart uses prevYear. If prevYear = easterYear-1, Advent in prevYear (Nov/Dec prevYear). Christmas is Dec 25 of prevYear.
  // So keep christmasYMD as {prevYear,12,25}
  const christmasDate = toUTC(
    christmasYMD.year,
    christmasYMD.month,
    christmasYMD.day
  );

  // Epiphany and Baptism: epiphany in calendar year = next calendar year after adventStart (i.e., prevYear+1) ??? Need clarity:
  // The liturgical year starting in Advent prevYear has Christmas on prevYear Dec 25, and Epiphany on following January (prevYear+1)
  const holyFamily = holyFamilySunday(christmasDate.getFullYear()); // Dec 26 of prevYear+1 (i.e., next calendar year)
  const epiphany = epiphanySunday(prevYear + 1);
  const baptism = baptismOfTheLord(epiphany);

  // Ash Wednesday = Easter - 46
  const ash = addDaysYMD(easter, -46);

  // First Sunday of Lent = next Sunday on or after Ash Wednesday (often immediate Sunday after Ash Wed)
  const firstSunOfLent = nextSundayOnOrAfter(ash);

  // Palm Sunday = Easter -7
  const palm = addDaysYMD(easter, -7);
  // Holy Thursday, Good Friday, Holy Saturday
  const holyThursday = addDaysYMD(easter, -3);
  const goodFriday = addDaysYMD(easter, -2);
  const holySaturday = addDaysYMD(easter, -1);

  // Ascension: in VN -> Sunday near +42
  const ascension = addDaysYMD(easter, 42);
  const pentecost = addDaysYMD(easter, 49);
  const trinity = addDaysYMD(easter, 56);
  const corpus = addDaysYMD(trinity, 7);
  const sacredHeart = addDaysYMD(corpus, 5);
  const immaculateHeart = addDaysYMD(sacredHeart, 1);

  // Christ the King: the Sunday immediately before the next Advent start
  // find prev Sunday on or before day before nextAdventStart
  const dayBeforeNextAdventDate = addDaysDate(
    toUTC(nextAdventStart.year, nextAdventStart.month, nextAdventStart.day),
    -1
  );
  const christTheKingDate = prevSundayOnOrBefore({
    year: dayBeforeNextAdventDate.getFullYear(),
    month: dayBeforeNextAdventDate.getMonth() + 1,
    day: dayBeforeNextAdventDate.getDate(),
  });

  // Build series of Sundays
  const items = [];

  // Helper to push an item
  function pushItem(sundayName, weekNumber, ymd, label, prority = 0) {
    const { day, month, year = easterYear } = ymd;
    let dayFeast = items.find((i) => i.m === month && i.d === day);

    // Nếu ngày chưa có gì, thêm mới
    if (!dayFeast) {
      items.push({
        sundayName,
        weekNumber,
        y: year,
        m: month,
        d: day,
        label,
        prority,
      });
      return;
    }

    const existingPriority = dayFeast.prority ?? prorityFeasts.sunday;

    switch (prority) {
      case prorityFeasts.solemnityOverride: {
        // Lễ trọng override -> hoàn toàn thay thế CN
        Object.assign(dayFeast, {
          sundayName,
          label,
          prority,
        });
        return;
      }

      case prorityFeasts.solemnity: {
        // Lễ trọng thường -> giữ tên CN + thêm tên lễ
        Object.assign(dayFeast, {
          sundayName: `${dayFeast.sundayName}\n${label}`,
          label,
          prority,
        });
        return;
      }

      case prorityFeasts.feastOverride: {
        // Lễ kính override -> giữ CN + thêm tên lễ
        Object.assign(dayFeast, {
          sundayName: `${dayFeast.sundayName}\n${label}`,
          label,
          prority,
        });
        return;
      }

      case prorityFeasts.feast: {
        // Lễ kính thường -> chỉ nếu không phải CN hay lễ trọng
        if (existingPriority >= prorityFeasts.sunday) return;
        Object.assign(dayFeast, {
          sundayName,
          label,
          prority,
        });
        return;
      }
      case prorityFeasts.memorialOverride: {
        // Lễ nhớ ghi đè -> chỉ khi không phải CN hoặc lễ cao hơn
        if (existingPriority >= prorityFeasts.sunday) return;
        // Ghi đè nếu ngày hiện tại là lễ nhớ thường hoặc chưa có gì
        if (existingPriority <= prorityFeasts.memorialOverride) return;
        Object.assign(dayFeast, {
          sundayName,
          label,
          prority,
        });
        return;
      }

      case prorityFeasts.memorial: {
        // Lễ nhớ thường -> chỉ khi không phải CN, lễ trọng, hay lễ kính
        if (existingPriority >= prorityFeasts.sunday) return;
        // Không ghi đè nếu đã có lễ nhớ override
        if (existingPriority === prorityFeasts.memorialOverride) return;
        Object.assign(dayFeast, {
          sundayName,
          label,
          prority,
        });
        return;
      }

      default:
        return;
    }
  }

  // 1) MÙA VỌNG — CN I -> CN IV (4 Sundays)
  // Start at adventStart; list 4 consecutive Sundays (adventStart + 0, +7, +14, +21)
  for (let i = 0; i < 4; i++) {
    const dt = addDaysYMD(adventStart, i * 7);
    const name = `CN ${Roman(i + 1)} Mùa Vọng`;
    pushItem(
      name,
      i + 1,
      dt,
      i === 3 ? "CN IV Mùa Vọng (CN Gaudete nếu thích)" : "",
      0
    );
  }
  // 2) GIÁNG SINH SEASON: Christmas (25/12), then Sundays of Christmas season:
  // We'll include: Lễ Giáng Sinh (25/12), CN trong Giáng Sinh (CN after Christmas) up to Epiphany/Baptism
  // For simplicity, include Christmas day (as special) and any Sundays between Dec25 and Epiphany (inclusive).
  // Add Christmas day as a special "Lễ Giáng Sinh"

  // Giáng Sinh (25/12)

  // Add Sundays from the Sunday on/after Dec25 up to (and including) Baptism of the Lord's Sunday
  // find first Sunday on or after Dec25 of prevYear
  const firstSunAfterChristmas = nextSundayOnOrAfter(christmasYMD);
  // iterate Sundays until baptism (inclusive)
  let cur = firstSunAfterChristmas;
  let weekCount = 1;
  while (true) {
    // stop if cur is after baptism
    const curDate = toUTC(cur.year, cur.month, cur.day);
    const bapDate = toUTC(baptism.year, baptism.month, baptism.day);
    if (curDate.getTime() > bapDate.getTime()) break;
    const name = `CN ${Roman(weekCount)} Mùa Giáng Sinh`;
    pushItem(name, weekCount, cur, "");
    cur = addDaysYMD(cur, 7);
    weekCount++;
  }

  pushItem(
    "Giáng Sinh (Lễ Chúa Giáng Sinh)",
    null,
    christmasYMD,
    "Mừng Chúa Giáng Sinh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Thánh Gia Thất",
    null,
    holyFamily,
    "Sau lễ Giáng Sinh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Chúa Hiển Linh",
    null,
    epiphany,
    "Chúa Hiển Linh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Chúa Giêsu chịu phép rửa",
    null,
    baptism,
    "Chúa Giêsu chịu phép rửa",
    prorityFeasts.solemnityOverride
  );

  // 3) MÙA THỨNG NIEN: CN I Mùa TN -> CN VII Mùa TN (thường 7 CN, tuỳ năm)
  // First Sunday of Ordination is 7 days after Baptism
  let weekCountOrdinary = 2;
  let curOrd = addDaysYMD(baptism, 7);
  while (true) {
    const curDate = toUTC(curOrd.year, curOrd.month, curOrd.day);
    const ashDate = toUTC(ash.year, ash.month, ash.day);
    if (curDate.getTime() >= ashDate.getTime()) break;
    const name = `CN ${Roman(weekCountOrdinary)} Mùa TN`;
    pushItem(name, weekCountOrdinary, curOrd, "", prorityFeasts.sunday);
    curOrd = addDaysYMD(curOrd, 7);
    weekCountOrdinary++;
    // safety limit
    if (weekCountOrdinary > 10) break;
  }

  // 4) MÙA CHAY: CN I Mùa Chay -> CN VI Mùa Chay (thường 6 CN, tuỳ năm)
  // First Sunday of Lent is nextSundayOnOrAfter(ash)

  pushItem(
    "Lễ Tro, giữ chay & kiêng thịt",
    null,
    ash,
    "Lễ Tro,\ngiữ chay & kiêng thịt",
    prorityFeasts.feastOverride
  );

  let curLent = nextSundayOnOrAfter(ash);
  weekCount = 1;
  while (true) {
    const curDate = toUTC(curLent.year, curLent.month, curLent.day);
    // stop when curLent >= Palm Sunday
    const palmDate = toUTC(palm.year, palm.month, palm.day);
    if (curDate.getTime() >= palmDate.getTime()) break;
    const name = `CN ${Roman(weekCount)} Mùa Chay`;
    pushItem(name, weekCount, curLent, name, prorityFeasts.feastOverride);
    curLent = addDaysYMD(curLent, 7);
    weekCount++;
    if (weekCount > 6) break;
  }

  // Add Palm Sunday and Holy Week entries
  pushItem("CN Lễ Lá", null, palm, "Bắt đầu Tuần Thánh");
  pushItem(
    "Thứ Hai Tuần Thánh",
    null,
    addDaysYMD(holyThursday, -3),
    "Thứ Hai Tuần Thánh",
    prorityFeasts.feast
  );
  pushItem(
    "Thứ Ba Tuần Thánh",
    null,
    addDaysYMD(holyThursday, -2),
    "Thứ Ba Tuần Thánh",
    prorityFeasts.feastOverride
  );
  pushItem(
    "Thứ Tư Tuần Thánh",
    null,
    addDaysYMD(holyThursday, -1),
    "Thứ Tư Tuần Thánh",
    prorityFeasts.feastOverride
  );
  pushItem(
    "Thứ Năm Tuần Thánh",
    null,
    holyThursday,
    "Thứ Năm Tuần Thánh",
    prorityFeasts.feastOverride
  );
  pushItem(
    "Thứ Sáu Tuần Thánh",
    null,
    goodFriday,
    "Thứ Sáu Tuần Thánh \n giữ chay & kiêng thịt",
    prorityFeasts.feastOverride
  );
  pushItem(
    "Thứ Bảy Tuần Thánh",
    null,
    holySaturday,
    "Thứ Bảy Tuần Thánh",
    prorityFeasts.feastOverride
  );

  // 5) PHỤC SINH & MÙA PHỤC SINH
  pushItem("Lễ Phục Sinh", 1, easter, "", prorityFeasts.sunday);
  // After Easter, list Sundays of Easter season until Pentecost (7 weeks including Easter)
  let curEasterSun = easter; // Easter Sunday is week 1
  for (let i = 1; i <= 6; i++) {
    const dt = addDaysYMD(easter, i);
    pushItem(
      "Tuần Bát Nhật Phục Sinh",
      null,
      dt,
      "Tuần Bát Nhật Phục Sinh",
      prorityFeasts.solemnity
    );
  }
  for (let w = 2; w <= 7; w++) {
    // Easter + 0..6 full weeks -> Pentecost is after 7 weeks (49 days)
    const dt = addDaysYMD(easter, (w - 1) * 7);
    const name = w === 1 ? `CN Phục Sinh` : `CN ${Roman(w)} Mùa Phục Sinh`;
    pushItem(name, w, dt, "", prorityFeasts.sunday);
  }

  pushItem(
    "Lễ Thăng Thiên",
    null,
    ascension,
    "Chúa Giêsu Lên Trời",
    prorityFeasts.solemnityOverride
  );

  // 6) THỜI GIAN THƯỜNG NIÊN SAU PENTECOST -> until Christ the King (last Sunday before next Advent)
  // Start at first Sunday after Pentecost

  let curOrdPost = pentecost;
  weekCountOrdinary = 34;
  let curDate = toUTC(curOrdPost.year, curOrdPost.month, curOrdPost.day);
  let christDate = toUTC(
    christTheKingDate.year,
    christTheKingDate.month,
    christTheKingDate.day
  );
  while (true) {
    if (christDate.getTime().toString() <= curDate.getTime()) break;
    const name = `CN ${Roman(weekCountOrdinary)} Mùa TN`;

    pushItem(
      name,
      weekCountOrdinary,
      dateToYMD(christDate),
      name,
      prorityFeasts.sunday
    );
    let timeLine = minusDaysYMD(christDate, 7);

    christDate = toUTC(timeLine.year, timeLine.month, timeLine.day);

    weekCountOrdinary--;
    if (weekCountOrdinary == 8) break;
  }

  // Pentecost Sunday
  pushItem(
    "CN Lễ Hiện Xuống (Pentecost)",
    null,
    pentecost,
    "Chúa Thánh Thần Hiện Xuống",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Đức Trinh Nữ Maria\nMẹ Hội Thánh",
    null,
    addDaysYMD(pentecost, 1),
    "Đức Trinh Nữ Maria Mẹ Hội Thánh",
    prorityFeasts.memorial
  );

  // Trinity Sunday (CN sau Hiện Xuống)
  pushItem(
    "CN Lễ Chúa Ba Ngôi",
    null,
    trinity,
    "Chúa Ba Ngôi",
    prorityFeasts.solemnityOverride
  );

  // Corpus Christi (Mình Máu Thánh)
  pushItem(
    "Lễ Mình Máu Thánh Chúa",
    null,
    corpus,
    "Lễ Mình Máu Thánh Chúa",
    prorityFeasts.solemnityOverride
  );

  // Sacred Heart (Thánh Tâm)
  pushItem(
    "Thánh Tâm Chúa Giêsu",
    null,
    sacredHeart,
    "Thánh Tâm Chúa Giêsu",
    prorityFeasts.solemnity
  );
  // Immaculate Heart (Trái Tim Vô Nhiễm)
  pushItem(
    "Trái Tim Vô Nhiễm Đức Mẹ Maria",
    null,
    immaculateHeart,
    "Trái Tim Vô Nhiễm Đức Mẹ Maria",
    prorityFeasts.memorialOverride
  );
  // Add Christ the King
  pushItem(
    "Chúa Kitô Vua Vũ Trụ",
    34,
    christTheKingDate,
    "Kết thúc Năm Phụng Vụ",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Kỷ niệm cung hiến Thánh Đường Laterano",
    null,
    { day: 9, month: 11, year: easterYear },
    "Kỷ niệm cung hiến Thánh Đường Laterano",
    prorityFeasts.feastOverride
  );

  // thêm lễ nhớ
  pushItem(
    "Mẹ Thiên Chúa",
    null,
    { day: 1, month: 1, year: easterYear },
    "Đức Maria Mẹ Thiên Chúa",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Basiliô Cả\nvà thánh Grêgôriô Nazianzênô, Gm, tsht",
    null,
    { day: 2, month: 1, year: easterYear },
    "Thánh Basiliô Cả\nvà thánh Grêgôriô Nazianzênô, Gm, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Danh Thánh Chúa Giêsu",
    null,
    { day: 3, month: 1, year: easterYear },
    "Danh Thánh Chúa Giêsu",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Antôn, viện phụ",
    null,
    { day: 17, month: 1, year: easterYear },
    "Thánh Antôn, viện phụ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Anê, trinh nữ, tử đạo",
    null,
    { day: 21, month: 1, year: easterYear },
    "Thánh Anê, trinh nữ, tử đạo",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Phanxicô Salêsiô, gm, tsht",
    null,
    { day: 24, month: 1, year: easterYear },
    "Thánh Phanxicô Salêsiô, gm, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Phalô Tông Đồ trở lại",
    null,
    { day: 25, month: 1 },
    "Thánh Phalô Tông Đồ trở lại",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Timôthêô và thánh Titô, gm",
    null,
    { day: 26, month: 1, year: easterYear },
    "Thánh Timôthêô và thánh Titô, gm",
    prorityFeasts.memorial
  );
  pushItem(
    "Chân phước George Matulaitis",
    null,
    { day: 27, month: 1, year: easterYear },
    "Chân phước George Matulaitis, lm, tsht",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Tôma Aquinô, Tsht",
    null,
    { day: 28, month: 1, year: easterYear },
    "Thánh Tôma Aquinô, Lm, Tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Gioan Bosco, lm",
    null,
    { day: 31, month: 1, year: easterYear },
    "Thánh Gioan Bosco, lm",
    prorityFeasts.memorial
  );
  pushItem(
    "Dâng Chúa Giêsu trong đền thánh",
    null,
    { day: 2, month: 2, year: easterYear },
    "Dâng Chúa Giêsu trong đền thánh",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Agatha, trinh nữ, tđ",
    null,
    { day: 5, month: 2, year: easterYear },
    "Thánh Agatha, trinh nữ, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Phaolô Miki và bạn tử đạo",
    null,
    { day: 6, month: 2, year: easterYear },
    "Thánh Phaolô Miki và bạn tử đạo",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Scholastica, trinh nữ",
    null,
    { day: 10, month: 2 },
    "Thánh Scholastica, trinh nữ",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Lộ Đức",
    null,
    { day: 11, month: 2 },
    "Đức Mẹ Lộ Đức",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Cyrillô & thánh Mêthôđiô",
    null,
    { day: 14, month: 2 },
    "Thánh Cyrillô & thánh Mêthôđiô",
    prorityFeasts.memorial
  );
  pushItem(
    "Cp. Antôn Leszczewicz, Tđ",
    null,
    { day: 17, month: 2 },
    "Cp. Antôn Leszczewicz, Tđ",
    prorityFeasts.feast
  );
  pushItem(
    "Chân phước George Kaszyra, Tđ",
    null,
    { day: 18, month: 2 },
    "Chân phước George Kaszyra, Tđ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Giuse\nBạn trăm năm Đức Maria",
    null,
    { day: 19, month: 3 },
    "Thánh Giuse\nBạn trăm năm Đức Maria",
    prorityFeasts.solemnity
  );
  pushItem(
    "Truyền Tin",
    null,
    { day: 25, month: 3 },
    "Truyền Tin",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Máccô\nTác giả sách Tin Mừng",
    null,
    { day: 25, month: 4 },
    "Thánh Máccô\nTác giả sách Tin Mừng",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Catarina Siênna",
    null,
    { day: 29, month: 4 },
    "Thánh Catarina Siênna",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Giuse thợ",
    null,
    { day: 1, month: 5 },
    "Thánh Giuse thợ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Athanhasiô, gm, tsht",
    null,
    { day: 2, month: 5 },
    "Thánh Athanasiô, gm, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Fatima",
    null,
    { day: 13, month: 5 },
    "Đức Mẹ Fatima",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Matthia Tông Đồ",
    null,
    { day: 14, month: 5 },
    "Thánh Matthia Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Stanislaô Papczynski",
    null,
    { day: 18, month: 5 },
    "Thánh Stanislaô Papczynski",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Philipphê Nêri, lm",
    null,
    { day: 26, month: 5 },
    "Thánh Philipphê Nêri, lm",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Maria thăm viếng bà Elisabeth",
    null,
    { day: 31, month: 5 },
    "Đức Maria thăm viếng bà Elisabeth",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Justinô,tđ",
    null,
    { day: 1, month: 6 },
    "Thánh Justinô,tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Carôlô Lwanga và bạn tử đạo",
    null,
    { day: 3, month: 6 },
    "Thánh Carôlô Lwanga và bạn tử đạo",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Bônifatiô, gm, tđ",
    null,
    { day: 5, month: 6 },
    "Thánh Bônifatiô, gm, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Barnaba Tông Đồ",
    null,
    { day: 11, month: 6 },
    "Thánh Barnaba Tông Đồ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Antôn Pađôva",
    null,
    { day: 13, month: 6 },
    "Thánh Antôn Pađôva",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Luy Gônzaga",
    null,
    { day: 21, month: 6 },
    "Thánh Luy Gônzaga",
    prorityFeasts.memorial
  );
  pushItem(
    "Sinh Nhật Thánh Gioan Tẩy Giả",
    null,
    { day: 24, month: 6 },
    "Sinh Nhật Thánh Gioan Tẩy Giả",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Irênê, gm, tđ",
    null,
    { day: 28, month: 6 },
    "Thánh Irênê, gm, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Phêrô và Thánh Phaolô Tông Đồ",
    null,
    { day: 29, month: 6 },
    "Thánh Phêrô và Thánh Phaolô Tông Đồ",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Tôma Tông Đồ",
    null,
    { day: 3, month: 7 },
    "Thánh Tôma Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Benêđictô viện phụ",
    null,
    { day: 11, month: 7 },
    "Thánh Benêđictô viện phụ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Bonaventura, gm, tsht",
    null,
    { day: 15, month: 7 },
    "Thánh Bonaventura, gm, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Núi Cát Minh",
    null,
    { day: 16, month: 7 },
    "Đức Mẹ Núi Cát Minh",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Maria Mađalêna",
    null,
    { day: 22, month: 7 },
    "Thánh Maria Mađalêna",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Giacôbê Tông Đồ",
    null,
    { day: 25, month: 7 },
    "Thánh Giacôbê Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Joachim và Thánh Anna",
    null,
    { day: 26, month: 7 },
    "Thánh Joachim và Thánh Anna",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Martha, Maria và Ladarô",
    null,
    { day: 29, month: 7 },
    "Thánh Martha, Maria và Ladarô",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Ignatiô Lôyôla, lm",
    null,
    { day: 31, month: 7 },
    "Thánh Ignatiô Lôyôla, lm",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Alphongsô Maria Liguori",
    null,
    { day: 1, month: 8 },
    "Thánh Alphongsô Maria Liguori",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Gioan Vianney, lm",
    null,
    { day: 4, month: 8 },
    "Thánh Gioan Vianney, lm",
    prorityFeasts.memorial
  );
  pushItem(
    "Chúa Hiển Dung",
    null,
    { day: 6, month: 8 },
    "Chúa Hiển Dung",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Đaminh",
    null,
    { day: 8, month: 8 },
    "Thánh Đaminh",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Laurensô",
    null,
    { day: 10, month: 8 },
    "Thánh Laurensô",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Clara",
    null,
    { day: 11, month: 8 },
    "Thánh Clara",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Maximilianô Maria Kolbê, lm, tđ",
    null,
    { day: 14, month: 8 },
    "Thánh Maximilianô Maria Kolbê, lm, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Hồn Xác Lên Trời",
    null,
    { day: 15, month: 8 },
    "Đức Mẹ Hồn Xác Lên Trời",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Thánh Bernarđô, tsht",
    null,
    { day: 20, month: 8 },
    "Thánh Bernarđô, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Piô X, gíáo hoàng",
    null,
    { day: 21, month: 8 },
    "Thánh Piô X, giáo hoàng",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Maria Nữ Vương",
    null,
    { day: 22, month: 8 },
    "Đức Maria Nữ Vương",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Barthôlômêô Tông Đồ",
    null,
    { day: 24, month: 8 },
    "Thánh Barthôlômêô Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Mônica",
    null,
    { day: 27, month: 8 },
    "Thánh Monica",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Augustinô, gm, tsht",
    null,
    { day: 28, month: 8 },
    "Thánh Augustinô, gm, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Gioan Tẩy Giả bị trảm quyết",
    null,
    { day: 29, month: 8 },
    "Thánh Gioan Tẩy Giả bị trảm quyết",
    prorityFeasts.memorial
  );
  pushItem(
    "Ngày quốc khánh\ncầu cho tổ quốc",
    null,
    { day: 2, month: 9 },
    "Ngày quốc khánh\ncầu cho tổ quốc",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Grêgôriô Cả",
    null,
    { day: 3, month: 9 },
    "Thánh Grêgôriô Cả",
    prorityFeasts.memorial
  );
  pushItem(
    "Sinh Nhật Đức Maria",
    null,
    { day: 8, month: 9 },
    "Sinh Nhật Đức Maria",
    prorityFeasts.feast
  );
  pushItem(
    "Danh Thánh Đức Maria",
    null,
    { day: 12, month: 9 },
    "Danh Thánh Đức Maria",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Gioan Kim Khẩu",
    null,
    { day: 13, month: 9 },
    "Thánh Gioan Kim Khẩu",
    prorityFeasts.memorial
  );
  pushItem(
    "Suy tôn Thánh Giá",
    null,
    { day: 14, month: 9 },
    "Suy tôn Thánh Giá",
    prorityFeasts.feast
  );
  pushItem(
    "Đức Mẹ Sầu Bi",
    null,
    { day: 15, month: 9 },
    "Đức Mẹ Sầu Bi",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Cornêliô & thánh Cyprianô, tđ",
    null,
    { day: 16, month: 9 },
    "Thánh Cornêliô & thánh Cyprianô, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Anrê Kim Têgon, Phaolô Chong Hasang và bạn tử đạo",
    null,
    { day: 20, month: 9 },
    "Thánh Anrê Kim Têgon, Phaolô Chong Hasang và bạn tử đạo",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Matthêu Tông Đồ",
    null,
    { day: 21, month: 9 },
    "Thánh Matthêu Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Piô Pietrelcina, lm",
    null,
    { day: 23, month: 9 },
    "Thánh Piô Pietrelcina, lm",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Vinh Sơn Phaolô",
    null,
    { day: 27, month: 9 },
    "Thánh Vinh Sơn Phaolô",
    prorityFeasts.memorial
  );
  pushItem(
    "Các Tổng Lãnh Thiên Thần Michaen, Gabriel, Raphael",
    null,
    { day: 29, month: 9 },
    "Các Tổng Lãnh Thiên Thần Michaen, Gabriel, Raphael",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Giêrônimô, tsht",
    null,
    { day: 30, month: 9 },
    "Thánh Giêrônimô, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Têrêsa Hài Đồng Giêsu, tsht",
    null,
    { day: 1, month: 10 },
    "Thánh Têrêsa Hài Đồng Giêsu, tsht",
    prorityFeasts.feast
  );
  pushItem(
    "Các Thiên Thần hộ thủ",
    null,
    { day: 2, month: 10 },
    "Các Thiên Thần hộ thủ",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Mân Côi",
    null,
    { day: 7, month: 10 },
    "Đức Mẹ Mân Côi",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Têresa Avila, tsht",
    null,
    { day: 15, month: 10 },
    "Thánh Têrêsa Avila, tsht",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Ignatiô Antiôkia, tđ",
    null,
    { day: 17, month: 10 },
    "Thánh Ignatiô Antiôkia, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Luca Tông Đồ",
    null,
    { day: 18, month: 10 },
    "Thánh Luca Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Gioan Phaolô II, gíáo hoàng",
    null,
    { day: 22, month: 10 },
    "Thánh Gioan Phaolô II, giáo hoàng",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Simon & thánh Giuđa Tông Đồ",
    null,
    { day: 28, month: 10 },
    "Thánh Simon & thánh Giuđa Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Lễ Các Thánh",
    null,
    { day: 1, month: 11 },
    "Lễ Các Thánh",
    prorityFeasts.solemnity
  );
  pushItem(
    "Lễ cầu cho các Tín hữu đã qua đời",
    null,
    { day: 2, month: 11 },
    "Lễ cầu cho các Tín hữu đã qua đời",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Carôlô Borrômêô",
    null,
    { day: 4, month: 11 },
    "Thánh Carôlô Borrômêô",
    prorityFeasts.memorial
  );
  pushItem(
    "Cung hiến thánh đường Latêranô",
    null,
    { day: 9, month: 11 },
    "Cung hiến thánh đường Latêranô",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Lêô Cả",
    null,
    { day: 10, month: 11 },
    "Thánh Lêô Cả",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Martinô,gm",
    null,
    { day: 11, month: 11 },
    "Thánh Martinô,gm",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Josaphat, gm, tđ",
    null,
    { day: 12, month: 11 },
    "Thánh Josaphat, gm, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Êlisabét Hungari",
    null,
    { day: 17, month: 11 },
    "Thánh Êlisabét Hungari",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Dâng mình trong đền thờ",
    null,
    { day: 21, month: 11 },
    "Đức Mẹ Dâng mình trong đền thờ",
    prorityFeasts.memorial
  );
  pushItem(
    "Các Thánh Tử Đạo Việt Nam",
    null,
    { day: 24, month: 11, year: easterYear },
    "Các Thánh Tử Đạo Việt Nam",
    prorityFeasts.solemnity
  );
  pushItem(
    "Thánh Anrê Tông Đồ",
    null,
    { day: 30, month: 11, year: prevYear },
    "Thánh Anrê Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Phanxicô Xaviê",
    null,
    { day: 3, month: 12, year: prevYear },
    "Thánh Phanxicô Xaviê",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Ambrosiô",
    null,
    { day: 7, month: 12, year: prevYear },
    "Thánh Ambrosiô",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Vô Nhiễm Nguyên Tội",
    null,
    { day: 8, month: 12, year: prevYear },
    "Đức Mẹ Vô Nhiễm Nguyên Tội",
    prorityFeasts.solemnity
  );
  pushItem(
    "Kỉ niệm cung hiến Vương cung Thánh Đường Sài Gòn",
    null,
    { day: 9, month: 12, year: prevYear },
    "Kỉ niệm cung hiến Vương cung Thánh Đường Sài Gòn",
    prorityFeasts.feast
  );
  pushItem(
    "Đức Mẹ Loretô",
    null,
    { day: 10, month: 12, year: prevYear },
    "Đức Mẹ Loretô",
    prorityFeasts.memorial
  );
  pushItem(
    "Đức Mẹ Guadalupe",
    null,
    { day: 12, month: 12, year: prevYear },
    "Đức Mẹ Guadalupe",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Lucia, trinh nữ, tđ",
    null,
    { day: 13, month: 12, year: prevYear },
    "Thánh Lucia, trinh nữ, tđ",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Gioan Thánh Giá",
    null,
    { day: 14, month: 12, year: prevYear },
    "Thánh Gioan Thánh Giá",
    prorityFeasts.memorial
  );
  pushItem(
    "Thánh Stêphanô, tđ",
    null,
    { day: 26, month: 12, year: prevYear },
    "Thánh Stêphanô, tđ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Gioan Tông Đồ",
    null,
    { day: 27, month: 12, year: prevYear },
    "Thánh Gioan Tông Đồ",
    prorityFeasts.feast
  );
  pushItem(
    "Thánh Gia Thất",
    null,
    holyFamily,
    "Thánh Gia Thất",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Các Thánh Anh Hài",
    null,
    { day: 28, month: 12, year: prevYear },
    "Các Thánh Anh Hài",
    prorityFeasts.feast
  );

  // Sort items chronologically (from adventStart up to day before nextAdventStart)
  items.sort((A, B) => {
    const a = toUTC(A.y, A.m, A.d).getTime();
    const b = toUTC(B.y, B.m, B.d).getTime();
    return a - b;
  });

  // Filter to the liturgical year interval [adventStart, dayBeforeNextAdvent)
  const startMillis = toUTC(
    adventStart.year,
    adventStart.month,
    adventStart.day
  ).getTime();
  const endMillis = toUTC(
    nextAdventStart.year,
    nextAdventStart.month,
    nextAdventStart.day
  ).getTime();
  const filtered = items.filter((it) => {
    const t = toUTC(it.y, it.m, it.d).getTime();
    return t >= startMillis && t < endMillis;
  });

  // Return structure plus metadata
  return {
    adventStart,
    nextAdventStart,
    easter,
    items: filtered,
    epiphany,
    holyFamily,
    baptism,
    ash,
    palm,
    holyThursday,
    goodFriday,
    holySaturday,
    ascension,
    pentecost,
    trinity,
    corpus,
    sacredHeart,
    christTheKingDate,
  };
}

/* ============================
       Roman numeral helper for CN I, II, III, IV...
       ============================ */
function Roman(n) {
  const romans = [
    "",
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
    "XXII",
    "XXIII",
    "XXIV",
    "XXV",
    "XXVI",
    "XXVII",
    "XXVIII",
    "XXIX",
    "XXX",
    "XXXI",
    "XXXII",
    "XXXIII",
    "XXXIV",
  ];
  return romans[n] || n.toString();
}
