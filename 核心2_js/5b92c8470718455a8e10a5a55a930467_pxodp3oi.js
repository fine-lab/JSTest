let AbstractAPIHandler = require("AbstractAPIHandler");
let LogToDB = true;
const getNowDate = () => {
  let date = new Date();
  let sign2 = ":";
  let year = date.getFullYear(); // 年
  let month = date.getMonth() + 1; // 月
  let day = date.getDate(); // 日
  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); // 分
  let seconds = date.getSeconds(); //秒
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  hour = hour + 8 >= 24 ? hour + 8 - 24 : hour + 8;
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return year + "-" + month + "-" + day + " " + hour + sign2 + minutes + sign2 + seconds;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //科目表查询
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let subjectChartUrl = DOMAIN + "/yonbip/fi/fipub/accsubjectchart/getSubjectChart";
    let subjectChartApiResp = openLinker("POST", subjectChartUrl, "AT1703B12408A00002", null);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "科目表查询-获取账簿", reqt: subjectChartUrl, resp: subjectChartApiResp }));
    let subjectChartApiRespObj = JSON.parse(subjectChartApiResp);
    let subjectData = subjectChartApiRespObj.data;
    let accbookList = subjectData[0].accountbookIds;
    let queryRst = ObjectStore.queryByYonQL("select * from AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence", "developplatform");
    for (var i in accbookList) {
      let accountbookObj = accbookList[i];
      let id = accountbookObj.id;
      let isExisted = false;
      for (var j in queryRst) {
        let queryRstObj = queryRst[j];
        if (id == queryRstObj.ys_id) {
          isExisted = true;
          break;
        }
      }
      if (!isExisted) {
        ObjectStore.insert(
          "AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence",
          { ys_id: id, ys_code: accountbookObj.code, ys_name: accountbookObj.name, accsubjectchart: accountbookObj.accsubjectchart, isEnabled: false },
          "yb85e13182"
        );
      }
    }
    queryRst = ObjectStore.queryByYonQL("select ys_code from AT1703B12408A00002.AT1703B12408A00002.YS_U8dsSqquence where ds_sequence is null", "developplatform");
    let codeList = [];
    for (var k in queryRst) {
      codeList.push(queryRst[k].ys_code);
    }
    return { rst: true, noSetCount: codeList.length, codes: codeList.join() };
  }
}
exports({ entryPoint: MyAPIHandler });