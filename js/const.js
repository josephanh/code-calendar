const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const daysVie = [
  "Chúa Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];
const yearOfCalendar = 2026; // Năm của lịch muốn tạo
const prorityFeasts = {
  solemnityOverride: 4, // lễ trọng ghi đè chúa nhật
  solemnity: 3, // le trọng
  feastOverride: 2, // lễ kính ghi đè chúa nhật
  sunday: 0, // chúa nhật
  feast: -1, // lễ kính
  memorialOverride: -2, // lễ nhớ ghi đè
  memorial: -3, // lễ nhớ
};

const virtues = {
  0: "ĐỨC MẸ RẤT MỰC THANH KHIẾT",
  1: "ĐỨC MẸ RẤT MỰC KHÔN NGOAN",
  2: "ĐỨC MẸ RẤT KHIÊM NHƯỜNG",
  3: "ĐỨC MẸ RẤT TRUNG TÍN",
  4: "ĐỨC MẸ RẤT CẬY TIN",
  5: "ĐỨC MẸ RẤT VÂNG PHỤC",
  6: "ĐỨC MẸ RẤT KHÓ NGHÈO",
  7: "ĐỨC MẸ RẤT KIÊN NHẪN",
  8: "ĐỨC MẸ RẤT XÓT THƯƠNG",
  9: "ĐỨC MẸ RẤT SẦU KHỔ",
  // 10: "LẠY CHÚA, XIN CHO CÁC LINH HỒN ĐƯỢC NGHỈ YÊN MUÔN ĐỜI", // VÀ CHO ÁNH SÁNG NGÀN THU CHIẾU SOI TRÊN CÁC LINH HỒN ẤY!
  // 11: "LẠY ĐẤNG VÔ NHIỄM NGUYÊN TỘI", //XIN MANG ƠN CỨU ĐỘ VÀ SỰ CHỞ CHE CHO CHÚNG CON!
};
