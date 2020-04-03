//格式化go的时间
export function FormatGoTime(t) {
  var dateee = new Date(t).toJSON();
  var date = new Date(+new Date(dateee) + 3600000 * 8).toISOString().replace(/T/g, ' ').replace(/.[\d]{3}Z/, '')
  return date
}

export function FormatGoTimeUnix(t) {
  var dateee = new Date(t).toJSON();
  var date = new Date(+new Date(dateee) + 3600000 * 8).toISOString().replace(/T/g, ' ').replace(/.[\d]{3}Z/, '')
  return new Date(date).getTime()
}

//剪切字符
export function GetStringSub(t, l) {
  if (t.length > l) {
    return t.substring(0, l) + "..."
  } else {
    return t
  }
}

//获取当前时间
export function GetNowDate() {
  return GetDate((new Date()).getTime())
}

export function getRunTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours() + "";
  var minute = date.getMinutes() + "";
  var second = date.getSeconds() + "";

  if (hour.length == 1) {
    hour = "0" + hour;
  }

  if (minute.length == 1) {
    minute = "0" + minute;
  }

  if (second.length == 1) {
    second = "0" + second;
  }

  return hour + ":" + minute + ":" + second;
}


export function getRetnW() {
  var date = new Date();
  var day = date.getDay();
  var weeks = new Array("7", "1", "2", "3", "4", "5", "6");
  var week = weeks[day];
  return week
}