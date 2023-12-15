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
    let LogToDB = true;
    let urlStr = "https://www.example.com/";
    let custCode = request.custCode;
    let custId = request.custId;
    let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "调用接口获取AccessToken", reqt: "", resp: JSON.stringify(funcRes) })); //调用领域内函数写日志
    let accessToken = null;
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
      return { rst: false, msg: "未获取accessToken不能传递!" };
    }
    let bodyParam = {
      accessToken: accessToken,
      codeList: [custCode]
    };
    let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
    let rstObj = JSON.parse(apiResponse);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口获取客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
    ); //调用领域内函数写日志
    let nowTimeStr = getNowDate();
    var commLogObj = {
      id: custId,
      CommToFTLogList: [{ hasDefaultInit: true, commTime: nowTimeStr, GongSi_id: custId, commDirection: "2", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }]
    };
    var res = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", commLogObj, "3199a3d6");
    let shiBaiYuanYin = "success";
    let tongBuZhuangTai = true;
    if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
      //失败
      shiBaiYuanYin = rstObj.errMsg;
      tongBuZhuangTai = false;
    } else {
      //获取成功--可更新潜在客户档案
      if (rstObj.totalRecords == 0) {
        shiBaiYuanYin = "富通返回未查到客户【" + custCode + "】的档案";
        tongBuZhuangTai = false;
      } else {
        let custObj = rstObj.data[0]; //获取客户档案信息对象解析数据--TODO
        //更新潜在客户单据信息
        let biObj = { id: custId, laquShiJian: nowTimeStr };
        let biRes = ObjectStore.updateById("GT3734AT5.GT3734AT5.GongSi", biObj, "3199a3d6");
      }
    }
    return { rst: tongBuZhuangTai, msg: shiBaiYuanYin, apiResponse: apiResponse, res: res };
  }
}
exports({ entryPoint: MyAPIHandler });