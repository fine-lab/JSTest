let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let current = new Date().getTime();
    let lastYear = formatDate(new Date(current - 1000 * 60 * 60 * 24 * 365), " ", "yyyy-MM-dd HH:mm:ss");
    let sql = `select * from GT2015AT1.GT2015AT1.caiyinsshenqing WHERE createTime > '${lastYear}' AND shenqingren = ${request.id}`;
    var res = ObjectStore.queryByYonQL(sql);
    return { res };
  }
}
// 格式化日期的公共方法，未来可以抽出来
const formatDate = (time, separator = "-", type = "yyyy-MM-dd") => {
  if (!time && typeof time !== "number") {
    return "";
  }
  // 后台返回的时间戳可能是字符串类型的可能是几个时间戳
  let ary = [];
  let date;
  if (time instanceof Date) {
  } else {
    time = time && parseInt(time);
  }
  date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let sec = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  switch (type) {
    case "YY-MM":
      ary = [year, month];
      break;
    case "YY-MM-DD":
      ary = [year, month, day];
      break;
    case "hh-mm":
      ary = [hour, min];
      break;
    case "hh-mm-ss":
      ary = [hour, min, sec];
      break;
    case "MM-dd":
      ary = [month, day];
      break;
    // 假勤单据只显示到分
    case "Y-M-d-h-m-0":
      let str5 = [year, month, day].join("-");
      let str6 = [hour, min, "00"].join(":");
      ary = [str5, str6];
      break;
    case "Y-M-d-h-m-s":
      let str1 = [year, month, day].join("-");
      let str2 = [hour, min, sec].join(":");
      ary = [str1, str2];
      break;
    // 配合导出表格的文件名。。。
    case "y-m-d-h-m-s":
      let str3 = [year, month, day].join("-");
      let str4 = [hour, min, sec].join("-");
      ary = [str3, str4];
      break;
    // 显示到分
    case "y-m-d-h-m":
      let str7 = [year, month, day].join("/");
      let str8 = [hour, min].join(":");
      ary = [str7, str8];
      break;
    case "m-d-h-m":
      let str9 = [month, day].join("/");
      let str10 = [hour, min].join(":");
      ary = [str9, str10];
      break;
    case "yyyy-MM-dd HH:mm:ss":
      let str11 = [year, month, day].join("-");
      let str12 = [hour, min, sec].join(":");
      ary = [str11, str12];
      break;
    default:
      ary = [year, month, day];
  }
  return ary.join(separator);
};
exports({ entryPoint: MyAPIHandler });