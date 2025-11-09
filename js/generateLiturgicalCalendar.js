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
  const corpus = addDaysYMD(easter, 60);
  const sacredHeart = addDaysYMD(easter, 68);

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
    let dayFeast = items.find((i) => i.m === ymd.month && i.d === ymd.day);
    if (!dayFeast) {
      items.push({
        sundayName,
        weekNumber,
        y: ymd.year,
        m: ymd.month,
        d: ymd.day,
        label,
        prority,
      });
      return;
    }
    if (prority) {
      let sunday = !dayFeast?.prority;
      switch (prority) {
        case prorityFeasts.solemnityOverride: {
          // solemnityOverride
          Object.assign(dayFeast, { sundayName: sundayName, prority });
        }
        case prorityFeasts.solemnity: {
          // solemnity
          if (sunday) {
            Object.assign(dayFeast, {
              label: sundayName,
              prority,
            });
          } else {
            Object.assign(dayFeast, {
              sundayName: sundayName,
              prority,
            });
          }
        }
        case prorityFeasts.feastOverride: {
          // feastOverride
          if (sunday) {
            Object.assign(dayFeast, {
              label: sundayName,
              prority,
            });
          } else {
            Object.assign(dayFeast, {
              sundayName: sundayName,
              prority,
            });
          }
        }
        case prorityFeasts.feast: {
          // feast
          if (sunday) break;
          Object.assign(dayFeast, {
            sundayName: sundayName,
            prority,
          });
        }
        case prorityFeasts.memorial: {
          // memorial
          if (sunday) break;
          Object.assign(dayFeast, {
            sundayName: sundayName,
            prority,
          });
        }
        default:
          prority = 0;
      }
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
    "Lễ Trọng Mừng Chúa Giáng Sinh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Lễ Thánh Gia (Thánh Gia Giêsu, Maria, Giuse)",
    null,
    holyFamily,
    "Sau lễ Giáng Sinh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Lễ Chúa Hiển Linh",
    null,
    epiphany,
    "Lễ Trọng Mừng Chúa Hiển Linh",
    prorityFeasts.solemnityOverride
  );
  pushItem(
    "Lễ Chúa Giêsu chịu phép rửa",
    null,
    baptism,
    "Lễ Trọng Mừng Chúa Giêsu chịu phép rửa",
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

  pushItem("Thứ Tư Lễ Tro", null, ash, "Thứ Tư Lễ Tro", prorityFeasts.feastOverride);

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
  pushItem("Thứ Năm Tuần Thánh", null, holyThursday, "Tuần Thánh", prorityFeasts.feastOverride);
  pushItem("Thứ Sáu Tuần Thánh", null, goodFriday, "Tuần Thánh", prorityFeasts.feastOverride);
  pushItem("Thứ Bảy Tuần Thánh", null, holySaturday, "Tuần Thánh", prorityFeasts.feastOverride);

  // 5) PHỤC SINH & MÙA PHỤC SINH
  pushItem("Lễ Phục Sinh", 1, easter, "", prorityFeasts.sunday);
  // After Easter, list Sundays of Easter season until Pentecost (7 weeks including Easter)
  let curEasterSun = easter; // Easter Sunday is week 1
  for (let w = 2; w <= 7; w++) {
    // Easter + 0..6 full weeks -> Pentecost is after 7 weeks (49 days)
    const dt = addDaysYMD(easter, (w - 1) * 7);
    const name = w === 1 ? `CN Phục Sinh` : `CN ${Roman(w)} Mùa Phục Sinh`;
    pushItem(name, w, dt, "", prorityFeasts.sunday);
  }

  pushItem("Lễ Thăng Thiên", null, ascension, "Chúa Giêsu Lên Trời", prorityFeasts.solemnityOverride);

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

    pushItem(name, weekCountOrdinary, dateToYMD(christDate), name, prorityFeasts.sunday);
    let timeLine = minusDaysYMD(christDate, 7);

    christDate = toUTC(timeLine.year, timeLine.month, timeLine.day);

    weekCountOrdinary--;
    if (weekCountOrdinary == 8) break;
  }

  // Pentecost Sunday
  pushItem("CN Lễ Hiện Xuống (Pentecost)", null, pentecost, "", prorityFeasts.solemnityOverride);

  // Trinity Sunday (CN sau Hiện Xuống)
  pushItem("CN Lễ Chúa Ba Ngôi", null, trinity, "", prorityFeasts.solemnityOverride);

  // Corpus Christi (Mình Máu Thánh)
  pushItem("Lễ Mình Máu Thánh Chúa", null, corpus, "", prorityFeasts.solemnityOverride);

  // Sacred Heart (Thánh Tâm)
  pushItem("Lễ Thánh Tâm Chúa Giêsu", null, sacredHeart, "", prorityFeasts.solemnityOverride);
  // Add Christ the King
  pushItem(
    "Lễ Chúa Kitô Vua Vũ Trụ",
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
