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
    let custCode = request.custCode;
    let orgName = request.orgName;
    let billNo = "";
    let gsSuffix = "";
    if (includes(orgName, "建机")) {
      billNo = "b979b0e9";
      gsSuffix = "_JJ";
    } else if (includes(orgName, "环保")) {
      billNo = "7b52cdac";
      gsSuffix = "_HB";
    } else if (includes(orgName, "游乐")) {
      billNo = "04a3e644";
      gsSuffix = "_YL";
    } else {
      billNo = "3199a3d6";
    }
    let gsURI = "GT3734AT5.GT3734AT5.GongSi" + gsSuffix;
    let obj = JSON.parse(AppContext());
    let staffId = obj.currentUser.staffId;
    let insertRes = { id: "12" }; //ObjectStore.insert("GT3734AT5.GT3734AT5.reqUpdateCust",{reqTime:getNowDate(),custCode:custCode,operator:staffId,isSuccess:false},"99ebf2d8");
    let queryRes = ObjectStore.queryByYonQL("select *,Sales.name from " + gsURI + " where tongBuZhuangTai=1 and  (code='" + custCode + "' or FTCode='" + custCode + "')");
    return { data: queryRes, id: insertRes.id };
  }
}
exports({ entryPoint: MyAPIHandler });