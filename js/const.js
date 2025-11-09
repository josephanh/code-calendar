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
  memorial: -2, // lễ nhớ
}