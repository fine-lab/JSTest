function getMonday(datestr) {
  let date = new Date(datestr);
  let day = date.getDay();
  let deltaDay;
  if (day == 0) {
    deltaDay = 6;
  } else {
    deltaDay = day - 1;
  }
  let monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000);
  monday.setHours(0);
  monday.setMinutes(0);
  monday.setSeconds(0);
  return monday; //返回本周的周一的0时0分0秒
}
function getSunday(date) {
  let sunday = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
  sunday.setHours(23);
  sunday.setMinutes(59);
  sunday.setSeconds(59);
  return sunday; //返回本周的周日的23时59分59秒
}