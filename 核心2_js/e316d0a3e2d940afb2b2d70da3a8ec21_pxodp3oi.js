let AbstractAPIHandler = require("AbstractAPIHandler");
const getBeginDate = () => {
  //日期转字符串
  let paramDate = new Date();
  paramDate.setMonth(paramDate.getMonth() - 2);
  let syear = paramDate.getFullYear();
  let smonth = paramDate.getMonth() + 1;
  let sDate = paramDate.getDate();
  let dayStr = syear + "-" + (smonth >= 1 && smonth <= 9 ? "0" + smonth : smonth) + "-" + (sDate >= 1 && sDate <= 9 ? "0" + sDate : sDate);
  return dayStr;
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let exchangerateUrl = DOMAIN + "/yonbip/digitalModel/exchangerate/findByTime?startTime=";
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let targetCurrencyId = request.targetCurrencyId;
    let sourceCurrencyId = request.targetCurrencyId;
    let startTime = getBeginDate() + " 00:00:00"; //'2022-01-01 00:00:00';//request.startTime;
    let userID = request.userId;
    exchangerateUrl = exchangerateUrl + encodeURIComponent(startTime);
    let apiRes = openLinker("GET", exchangerateUrl, "GT3734AT5", null);
    let resObject = JSON.parse(apiRes);
    resObject.startTime = startTime;
    resObject.exchangerateUrl = UrlEncode(exchangerateUrl);
    return resObject;
  }
}
exports({ entryPoint: MyAPIHandler });