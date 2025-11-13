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
  let indexVir = 0;
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
      let feastNotOveride = document.createElement("div");
      let feastInfo = findByDay({ y: year, m: month + 1, d: day });

      if (feastInfo) {
        // Luôn hiển thị tên Chúa nhật nếu có
        if (feastInfo.sundayName) {
          sundayOrFeast.classList.add("sundayOrFeast");
          sundayOrFeast.innerText = feastInfo.sundayName;
        }

        // Gán class và label lễ theo priority
        switch (feastInfo.prority) {
          case prorityFeasts.solemnityOverride:
            sundayOrFeast.classList.add("solemnity");
            sundayOrFeast.innerText = feastInfo.label;
            break;

          case prorityFeasts.solemnity:
            feastNotOveride.classList.add("solemnity");
            feastNotOveride.innerText = feastInfo.label;
            cell.classList.add("solemnity");
            break;

          case prorityFeasts.feastOverride:
            if (
              !feastInfo.name.toString().includes("Mùa Chay") &&
              !feastInfo.name.toString().includes("Tro") &&
              !feastInfo.name.toString().includes("Tuần Thánh")
            ) {
              sundayOrFeast.classList.add("sundayOrFeast");
              sundayOrFeast.innerText = feastInfo.name;
            } else {
              feastNotOveride.classList.add("feast");
              feastNotOveride.innerText = feastInfo.label;
            }
            if (feastInfo.name.toString().includes("Tro")) {
              cell.classList.add("ashWednesday");
            }
            break;

          case prorityFeasts.feast:
            feastNotOveride.classList.add("feast");
            feastNotOveride.innerText = feastInfo.label;
            cell.classList.add("feast-1");
            break;

          case prorityFeasts.memorial:
          case prorityFeasts.memorialOverride:
            feastNotOveride.classList.add("memorial");
            feastNotOveride.innerText = feastInfo.label;
            break;
          case prorityFeasts.sunday:
            sundayOrFeast.classList.add("sundayOrFeast");
            sundayOrFeast.innerText = feastInfo.name || "chưa có";

            break;
        }
        if (
          feastInfo.name.toString().includes("Lễ Phục Sinh") ||
          feastInfo.name.toString().includes("Thứ Bảy Tuần Thánh") ||
          feastInfo.name.toString().includes("Thứ Năm Tuần Thánh") ||
          feastInfo.name.toString().includes("Thứ Sáu Tuần Thánh") ||
          feastInfo.name.toString().includes("Chúa Giáng Sinh")
        ) {
          cell.classList.add("espicialSunday");
        }

        if (feastInfo.label.toString().includes("Tro")) {
          cell.classList.add("ash");
        }
        if (
          feastInfo.name.toString().includes("Vô Nhiễm Nguyên Tội") ||
          feastInfo.name.toString().includes("Stanislaô Papczynski")
        ) {
          cell.classList.add("verySolemnity");
        }

        // Chỉ append khi có label lễ
        if (feastInfo.label) {
          sundayOrFeast.appendChild(feastNotOveride);
        }
      } else {
        sundayOrFeast.append(document.createElement('br'));
        sundayOrFeast.classList.add('sundayOrFeast');
      }
      // Đặc biệt: ba ngày Tết Nguyên Đán (mồng 1–3 tháng Giêng âm)
      if (lunar[1] === 1 && lunar[0] === 1) {
        sundayOrFeast.classList.add("sundayOrFeast");
        sundayOrFeast.textContent = `Tết Nguyên Đán`;
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
    let addText = "";
    let startCell = tbody.querySelector(".empty-cell.start");
    let endCell = row.querySelector(".empty-cell.end");

    // xác định nội dung cố định cho tháng 11/12
    let fixedText = "";
    if (month === 10) fixedText = `<div class="virtuesRev">LẠY CHÚA, XIN CHO CÁC LINH HỒN ĐƯỢC NGHỈ YÊN MUÔN ĐỜI</div><div class="virtuesRes">VÀ CHO ÁNH SÁNG NGÀN THU CHIẾU SOI TRÊN CÁC LINH HỒN ẤY!</div>`; // tháng 11
    else if (month === 11) fixedText = `<div class="virtuesRev">ĐỨC MẸ HỘ TRÌ<div class="virtuesRev">`; // tháng 12

    // **Số lượng nhân đức trong mảng virtues**
    const virtuesLen = Object.keys(virtues).length;

    if (emptyStart >= 3 || emptyEnd >= 3) {
      // **Trường hợp cả hai > 3: luôn thêm cho cả hai ô**
      if (emptyStart > 3 && emptyEnd > 3) {
        if (fixedText) {
          if (startCell) startCell.innerHTML = `<div>${fixedText}</div>`;
          if (endCell) endCell.innerHTML = `<div>${fixedText}</div>`;
          // **fixedText không làm thay đổi indexVir**
        } else {
          // **lấy hai nhân đức khác nhau (quay vòng nếu cần)**
          const v1 = virtues[indexVir % virtuesLen];
          const v2 = virtues[(indexVir + 1) % virtuesLen];
          if (startCell)
            startCell.innerHTML = `<div class="virtuesRev">${v1}</div><div class="virtuesRes">CẦU CHO CHÚNG CON</div>`;
          if (endCell)
            endCell.innerHTML = `<div class="virtuesRev">${v2}</div><div class="virtuesRes">CẦU CHO CHÚNG CON</div>`;
          // **tăng indexVir 2 bước và quay vòng**
          indexVir = (indexVir + 2) % virtuesLen;
        }
      } else {
        // **Chỉ một ô thỏa (thực hiện giống logic trước nhưng quay vòng khi cần)**
        if (emptyStart >= 3 && emptyStart > emptyEnd) {
          if (startCell) {
            addText = fixedText
              ? `<div class="virtuesRev">${fixedText}</div>`
              : `<div class="virtuesRev">${
                  virtues[indexVir % virtuesLen]
                }</div><div class="virtuesRes">CẦU CHO CHÚNG CON</div>`;
            startCell.innerHTML = addText;
            if (!fixedText) indexVir = (indexVir + 1) % virtuesLen;
          }
        }

        if (emptyEnd >= 3 && emptyEnd > emptyStart) {
          if (endCell) {
            addText = fixedText
              ? `${fixedText}`
              : `<div class="virtuesRev">${
                  virtues[indexVir % virtuesLen]
                }</div><div class="virtuesRes">CẦU CHO CHÚNG CON</div>`;
            endCell.innerHTML = addText;
            if (!fixedText) indexVir = (indexVir + 1) % virtuesLen;
          }
        }
      }
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
