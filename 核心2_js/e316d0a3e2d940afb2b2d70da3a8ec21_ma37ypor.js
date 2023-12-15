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
    let exchangerateUrl = "https://www.example.com/";
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    let reqEmail = request.reqEmail;
    let reqOrgId = request.reqOrgId;
    let targetCurrencyId = request.targetCurrencyId;
    let sourceCurrencyId = request.targetCurrencyId;
    let startTime = getBeginDate() + " 00:00:00"; //'2022-01-01 00:00:00';//request.startTime;
    let userID = request.userId;
    let apiRes = openLinker("GET", exchangerateUrl + encodeURIComponent(startTime), "GZTBDM", JSON.stringify({ startTime: startTime })); //+"?startTime="+startTime
    let resObject = JSON.parse(apiRes);
    resObject.startTime = startTime;
    resObject.exchangerateUrl = UrlEncode(exchangerateUrl);
    return resObject;
  }
}
exports({ entryPoint: MyAPIHandler });