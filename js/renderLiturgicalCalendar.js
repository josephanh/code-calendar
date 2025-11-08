/* ============================
       Render functions (UI)
       ============================ */
function renderLiturgicalTable(result) {
  const tbody = document.querySelector("#feastTable tbody");
  tbody.innerHTML = "";
  result.items.forEach((it) => {
    const row = document.createElement("tr");
    const seasonTd = document.createElement("td");
    seasonTd.className = "col-season";
    seasonTd.textContent = `${it.sundayName}`;
    const weekTd = document.createElement("td");
    weekTd.className = "col-week";
    weekTd.textContent = it.weekNumber ? String(it.weekNumber) : ".";
    const dateTd = document.createElement("td");
    dateTd.className = "col-date";
    const dt = toUTC(it.y, it.m, it.d);
    dateTd.textContent = `${dowNameViFromDate(dt)} - ${it.d} - ${it.m}`;
    const nameTd = document.createElement("td");
    nameTd.className = "col-name";
    nameTd.textContent = it.label || it.sundayName || it.season;
    row.appendChild(seasonTd);
    row.appendChild(weekTd);
    row.appendChild(dateTd);
    row.appendChild(nameTd);
    tbody.appendChild(row);
  });
  document.getElementById("totalItems").textContent = result.items.length;
}

/* ============================
       Main: wire up UI
       ============================ */
document.getElementById("calcBtn").addEventListener("click", () => {
  const input = document.getElementById("yearInput");
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1583 || val > 4099) {
    alert("Vui lòng nhập năm hợp lệ (1583–4099).");
    return;
  }

  // Build liturgical year relative to Easter in val
  const built = buildLiturgicalYearForEasterYear(val);
  console.log(built.items);
  
  // Easter display
  const easter = built.easter;
  const easterDate = toUTC(easter.year, easter.month, easter.day);
  const dow = dowNameViFromDate(easterDate);
  const easterLine = `${dow} - ${easter.day} - ${easter.month} - Lễ Phục Sinh`;
  document.getElementById("easterLine").textContent = easterLine;
  document.getElementById(
    "easterSub"
  ).textContent = `Dân dụng (dd/mm/yyyy): ${String(easter.day).padStart(
    2,
    "0"
  )}/${String(easter.month).padStart(2, "0")}/${easter.year}`;
  document.getElementById(
    "easterBadge"
  ).textContent = `Phục Sinh: ${easter.day}-${easter.month}-${easter.year}`;

  // Liturgical year letter A/B/C: compute based on Easter year as earlier: N = year - 1; MAP[N % 3] => A,B,C
  const map = ["A", "B", "C"];
  const letter = map[(val - 1) % 3];
  document.getElementById(
    "litBadge"
  ).textContent = `Năm phụng vụ: Năm ${letter} (bắt đầu Mùa Vọng ${built.adventStart.year}-${built.adventStart.month}-${built.adventStart.day})`;

  // Render table
  renderLiturgicalTable(built);

  // Show result box
  document.getElementById("resultBox").style.display = "block";
});

// allow Enter key to trigger
document.getElementById("yearInput").addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") {
    ev.preventDefault();
    document.getElementById("calcBtn").click();
  }
});

// Initialize with current year
(function init() {
  const now = new Date();
  const y = now.getFullYear();
  document.getElementById("yearInput").value = Math.min(
    4099,
    Math.max(1583, y)
  );
  document.getElementById("calcBtn").click();
})();
