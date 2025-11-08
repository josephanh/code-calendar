function convertMonthToText(month, style = "default") {
  // style: "default" = Tháng Một, "giêng" = Tháng Giêng
  const monthsDefault = [
    "Tháng Một",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Mười Hai"
  ];

  const monthsGieng = [
    "Tháng Giêng",
    "Tháng Hai",
    "Tháng Ba",
    "Tháng Tư",
    "Tháng Năm",
    "Tháng Sáu",
    "Tháng Bảy",
    "Tháng Tám",
    "Tháng Chín",
    "Tháng Mười",
    "Tháng Mười Một",
    "Tháng Chạp"
  ];

  if (month < 1 || month > 12) return "Tháng không hợp lệ";

  return style === "giêng" ? monthsGieng[month - 1] : monthsDefault[month - 1];
}

// Ví dụ dùng:
// console.log(convertMonthToText(1));         // "Tháng Một"
// console.log(convertMonthToText(1, "giêng"));// "Tháng Giêng"
// console.log(convertMonthToText(12));        // "Tháng Mười Hai"
// console.log(convertMonthToText(12, "giêng"));// "Tháng Chạp"

function convertMonthToEnglish(month, style = "long") {
  // style: "long" = January, "short" = Jan
  const monthsLong = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  if (month < 1 || month > 12) return "Invalid month";

  return style === "short" ? monthsShort[month - 1] : monthsLong[month - 1];
}

// Ví dụ dùng:
// console.log(convertMonthToEnglish(1));          // "January"
// console.log(convertMonthToEnglish(1, "short")); // "Jan"
// console.log(convertMonthToEnglish(12));         // "December"
// console.log(convertMonthToEnglish(12, "short"));// "Dec"
