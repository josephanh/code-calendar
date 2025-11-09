function generateCalendars() {
  const container = document.getElementById("all-calendars");
  container.innerHTML = "";

  // const year = parseInt(document.getElementById("yearInput").value);
  const year = yearOfCalendar;
  const font = document.getElementById("fontSelect").value;
  const fontSize = document.getElementById("fontSizeInput").value + "px";

  const built = buildLiturgicalYearForEasterYear(year);
  const nextYearofCal11 = buildLiturgicalYearForEasterYear(year + 1);
  built.items.push(...nextYearofCal11.items);
  console.log(built.items);
  const liturgicalCalendar = built.items;
  // console.log(liturgicalCalendar);

  function checkLiturgical(day, dom) {
    const item = liturgicalCalendar.find((i) => i.y === day.y && i.m === day.m);
    // console.log(item);
    return item;
  }

  function findByDay(day) {
    const result = liturgicalCalendar.find(
      (item) => item.y == day.y && item.m == day.m && item.d == day.d
    );
    // console.log(result, day);

    if (result) {
      return {
        name: result.sundayName,
        prority: result.prority,
        label: result.label,
      };
    }
    return null;
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  for (let month = 0; month < 12; month++) {
    const cal = document.createElement("div");
    cal.className = "calendar";
    // cal.style.fontFamily = font;
    // cal.style.fontSize = fontSize;

    const header = document.createElement("div");
    header.className = "calendar-header";
    // year
    const headerYear = document.createElement("div");
    headerYear.className = "calendar-header-year";
    headerYear.textContent = year;
    // logo
    const logoWrapper = document.createElement("div");
    logoWrapper.className = "calendar-logo-wrapper";
    const logo = document.createElement("img");
    logo.src =
      "https://upload.wikimedia.org/wikipedia/commons/b/b4/MIC_COA_2009.png";
    logo.alt = "Logo";
    logo.className = "calendar-logo";
    logoWrapper.appendChild(logo);
    // month
    const headerMonth = document.createElement("div");
    headerMonth.className = "calendar-header-month";
    const headerMonthL1 = document.createElement("div");
    const headerMonthL2 = document.createElement("div");
    headerMonthL1.textContent = `${convertMonthToEnglish(month + 1)}`;
    headerMonthL2.textContent = `${convertMonthToText(month + 1)}`;

    headerMonth.appendChild(headerMonthL1);
    headerMonth.appendChild(headerMonthL2);

    header.appendChild(document.createElement("div")); // spacer
    header.appendChild(headerYear);
    header.appendChild(logoWrapper);
    header.appendChild(headerMonth);

    cal.appendChild(header);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    days.forEach((d) => {
      const th = document.createElement("th");

      // Tiếng Việt
      const line1 = document.createElement("div");
      line1.textContent = daysVie[days.indexOf(d)];

      // English
      const line2 = document.createElement("div");

      line2.textContent = d;

      th.appendChild(line1);
      th.appendChild(line2);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    let firstDay = new Date(year, month, 1).getDay() + 1;
    // if (firstDay === 0) firstDay = 7; // CN = 7
    let day = 1;
    let row = document.createElement("tr");

    // Ô trống trước ngày 1
    let emptyStart = firstDay - 1;
    let currentCol = 0;
    if (emptyStart > 0) {
      const td = document.createElement("td");
      td.className = "empty-cell start";
      td.colSpan = emptyStart;
      row.appendChild(td);
      currentCol += emptyStart;
    }

    while (day <= daysInMonth[month]) {
      if (currentCol === 7) {
        tbody.appendChild(row);
        row = document.createElement("tr");
        currentCol = 0; // Reset cột
      }
      let lunar = convertSolar2Lunar(day, month + 1, year, 7); // timezone GMT+7 cho VN

      const cell = document.createElement("td");
      // Ngày dương (số to giữa)
      const solarDiv = document.createElement("div");
      solarDiv.classList.add("solar-day");
      solarDiv.textContent = day;

      // Ngày âm (số nhỏ góc trên phải)
      const lunarDiv = document.createElement("div");
      lunarDiv.classList.add("lunar-day");
      if (lunar[0] == 1) {
        if (lunar[3] == 1) {
          lunarDiv.textContent = lunar[0] + "/" + lunar[1] + " Nhuận"; // Tháng âm
        } else {
          lunarDiv.textContent = lunar[0] + "/" + lunar[1]; // Tháng âm
        }
      } else {
        lunarDiv.textContent = lunar[0]; // Ngày âm
      }

      // Tìm lễ phụng vụ trong ngày
      let sundayOrFeast = document.createElement("div");
      let feastNotOverite = document.createElement("div");
      let feastInfo = findByDay({ y: year, m: month + 1, d: day });

      if (feastInfo) {
        // Phân loại theo độ ưu tiên (priority)
        // console.log(feastInfo);
        if (feastInfo.prority === 3) {
          sundayOrFeast.classList.add("solemnity"); // Lễ trọng
        } else if (feastInfo.prority === 2) {
          feastNotOverite.classList.add("feast");
          feastNotOverite.innerText = feastInfo.label + "hello";
          sundayOrFeast.appendChild(feastNotOverite);
        } else if (feastInfo.prority === 1) {
          sundayOrFeast.classList.add("feast"); // Lễ kính
        } else if (feastInfo.prority === -1) {
          sundayOrFeast.classList.add("memorial"); // Lễ nhớ
        } else {
          sundayOrFeast.classList.add("sundayOrFeast"); // lễ chúa nhật
        }
        // Ghi tên lễ vào ô
        sundayOrFeast.innerText = feastInfo.name || "";
      }

      // Đặc biệt: ba ngày Tết Nguyên Đán (mồng 1–3 tháng Giêng âm)
      if (lunar[1] === 1 && lunar[0] >= 1 && lunar[0] <= 3) {
        console.log("Tết Nguyên Đán: " + lunar[0] + "/" + lunar[1]);
        sundayOrFeast.classList.add("sundayOrFeast");
        sundayOrFeast.textContent += `\nMùng ${lunar[0]} Tết Nguyên Đán`;
      }
      cell.appendChild(solarDiv);
      cell.appendChild(lunarDiv);

      // Đánh dấu ngày cuối tuần để tô màu đặc biệt
      if (currentCol === 0) cell.classList.add("sunday"); // Chủ nhật (cột đầu tiên)
      if (currentCol === 6) cell.classList.add("saturday"); // Thứ bảy (cột cuối cùng)

      cell.appendChild(sundayOrFeast);

      row.appendChild(cell);
      currentCol++;
      day++;
    }

    // Ô trống còn lại
    let emptyEnd = 7 - row.children.length;
    if (emptyEnd > 0) {
      const td = document.createElement("td");
      td.className = "empty-cell end";
      td.colSpan = emptyEnd;
      row.appendChild(td);
    }
    // Thêm nhân đức Đức Mẹ
    if (emptyStart > emptyEnd) {
      let startCell = tbody.querySelector(".empty-cell.start");
      if (startCell) startCell.innerHTML = "Bạn có thể ghi chú đầu tháng!";
      // console.log(startCell);
    } else if (emptyEnd > emptyStart) {
      let endCell = row.querySelector(".empty-cell.end");
      if (endCell) endCell.innerHTML = "Bạn có thể ghi chú cuối tháng!";
      // console.log("added note to start cell" + (month + 1));
    }
    // nếu bằng nhau thì không thêm gì cả
    // else if (emptyStart === emptyEnd && emptyStart > 0) {
    //   let startCell = row.querySelector(".empty-cell.start");
    //   let endCell = row.querySelector(".empty-cell.end");
    //   if (startCell) startCell.innerHTML = "Ghi chú đầu";
    //   if (endCell) endCell.innerHTML = "Ghi chú cuối";
    // }
    // console.log(emptyStart + " - " + emptyEnd + " in month " + (month + 1));
    tbody.appendChild(row);

    table.appendChild(tbody);
    cal.appendChild(table);
    container.appendChild(cal);
  }
}

// Update số px khi kéo slider
document.getElementById("fontSizeInput").addEventListener("input", (e) => {
  document.getElementById("fontSizeValue").textContent = e.target.value + "px";
});

async function downloadPDF() {
  openModal(); // Hiển thị modal thông báo
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const calendars = document.querySelectorAll(".calendar");

  for (let i = 0; i < calendars.length; i++) {
    const canvas = await html2canvas(calendars[i], {
      scale: 3.125,
      useCORS: true, // Cho phép tải ảnh từ nguồn khác
      allowTaint: true, // Cho phép vẽ ảnh từ nguồn khác

      backgroundColor: "#ffffff", // Không có nền
    });
    const imgData = canvas.toDataURL("image/png");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  }
  closeModal(); // Ẩn modal sau khi hoàn thành
  pdf.save("lich-12-thang.pdf");
}
const { jsPDF } = window.jspdf;
