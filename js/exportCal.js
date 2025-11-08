async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4"); // landscape, A4
  // Lấy tất cả các tháng có class "calendar"
  const calendars = document.querySelectorAll(".calendar");
  doc.addFont("./CrimsonText.ttf", "CrimsonText", "normal");
  doc.addFont("./CrimsonText-Bold.ttf", "CrimsonText", "bold");
  doc.addFont("./CrimsonText-BoldItalic.ttf", "CrimsonText", "bolditalic");
  doc.addFont("./CrimsonText-Italic.ttf", "CrimsonText", "italic");

  doc.setFont("CrimsonText", "normal");

  // console.log(doc.getFontList());

  for (let i = 0; i < calendars.length; i++) {
    let element = calendars[i];

    await doc.html(element, {
      x: 0,
      y: 0,
      width: 297,
      windowWidth: 1200,
      autoPaging: false,
      useCORS: true,
      allowTaint: true,
    });

    if (i < calendars.length - 1) {
      doc.addPage("a4", "l");
    }
  }

  doc.save("calendar.pdf");
}


function exportYearPDF() {
  const element = document.getElementById("all-calendars"); // div chứa tất cả calendar
  const opt = {
    margin: 0,
    filename: "calendar.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  };
  html2pdf().set(opt).from(element).save();
}
