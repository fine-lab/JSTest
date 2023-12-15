let AbstractAPIHandler = require("AbstractAPIHandler");
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
    let APPCODE = "GT3734AT5";
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let urlStr = DOMAIN + "/yonbip/digitalModel/merchant/detail";
    let queryDelLogRes = ObjectStore.queryByYonQL("select * from GT3734AT5.GT3734AT5.SysCustDelLog  order by DelTime limit 10", "developplatform");
    for (var i in queryDelLogRes) {
      let dataObj = queryDelLogRes[i];
      let DelContent = dataObj.DelContent;
      let delContentObj = JSON.parse(DelContent);
      for (var j in delContentObj) {
        let id = delContentObj[j].id;
        let extendCustomer = delContentObj[j].extendCustomer;
        //客户档案是否有该客户，无则清除关联记录
        let merchantResp = openLinker("GET", urlStr + "?id=" + id, APPCODE, JSON.stringify({ id: id }));
        let merchantRespObj = JSON.parse(merchantResp);
        if (merchantRespObj.code != 200) {
          let queryCustRes = ObjectStore.queryByYonQL("select id from GT3734AT5.GT3734AT5.GongSi where merchant='" + id + "'", "developplatform");
          for (var k in queryCustRes) {
            ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", { id: queryCustRes[k].id, merchant: "", isRelated: false, relateArchTime: "" }, "3199a3d6");
          }
        }
        ObjectStore.updateById("GT3734AT5.GT3734AT5.SysCustDelLog", { id: dataObj.id, IsExecuted: true, ExeTime: getNowDate() }, "409fad62");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });