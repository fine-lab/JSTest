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
    let custId = request.custId;
    let ftid = request.ftid;
    let obj = JSON.parse(AppContext());
    let tid = obj.currentUser.tenantId;
    let usrName = obj.currentUser.name;
    let staffId = obj.currentUser.staffId;
    let staffObj = extrequire("GT3734AT5.ServiceFunc.getBaseDocDetail").execute(null, JSON.stringify({ userId: staffId, docType: "staff" }));
    let operatorName = staffObj.data.name;
    let funcRes = extrequire("GT3734AT5.ServiceFunc.getAccessToken").execute(null);
    let accessToken = null;
    let orgName = request.orgName;
    let billNo = "3199a3d6"; //合一潜客单据
    let gsURI = "GT3734AT5.GT3734AT5.GongSi"; //合一潜客URI
    let gsSuffix = "";
    if (orgName != undefined && orgName != null) {
      billNo = request.billNo;
      if (includes(orgName, "建机")) {
        gsSuffix = "_JJ";
      } else if (includes(orgName, "环保")) {
        gsSuffix = "_HB";
      } else if (includes(orgName, "游乐")) {
        gsSuffix = "_YL";
      } else {
        gsSuffix = "";
      }
      gsURI = gsURI + gsSuffix;
    }
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: LogToDB, logModule: 0, description: "AccessToken为空-无法对接富通", reqt: "", resp: "" })); //调用领域内函数写日志
      return { rst: false, msg: "未获取accessToken不能传递!" };
    }
    let bodyParam = {
      accessToken: accessToken,
      operatorName: "安志强", //operatorName,
      idList: [ftid]
    };
    let apiResponse = postman("post", urlStr, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify(bodyParam));
    let rstObj = JSON.parse(apiResponse);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(
      null,
      JSON.stringify({ LogToDB: LogToDB, logModule: 1, description: "调用富通接口删除客户信息", reqt: JSON.stringify(bodyParam), resp: apiResponse })
    ); //调用领域内函数写日志
    let nowTimeStr = getNowDate();
    var commLogObj = {};
    if (gsSuffix == "_JJ") {
      commLogObj = {
        id: custId,
        CommToFTLog_JJList: [
          { hasDefaultInit: true, commTime: nowTimeStr, GongSi_JJ_id: custId, commDirection: "9", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ]
      };
    } else if (gsSuffix == "_HB") {
      commLogObj = {
        id: custId,
        CommToFTLog_HBList: [
          { hasDefaultInit: true, commTime: nowTimeStr, GongSi_HB_id: custId, commDirection: "9", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ]
      };
    } else if (gsSuffix == "_YL") {
      commLogObj = {
        id: custId,
        CommToFTLog_YLList: [
          { hasDefaultInit: true, commTime: nowTimeStr, GongSi_YL_id: custId, commDirection: "9", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }
        ]
      };
    } else {
      commLogObj = {
        id: custId,
        CommToFTLogList: [{ hasDefaultInit: true, commTime: nowTimeStr, GongSi_id: custId, commDirection: "9", reqContent: JSON.stringify(bodyParam), respContent: apiResponse, _status: "Insert" }]
      };
    }
    ObjectStore.updateById(gsURI, commLogObj, billNo); //加入通信数据
    let shiBaiYuanYin = "success";
    let tongBuZhuangTai = true;
    if (rstObj != null && (rstObj.code == 2 || !rstObj.success)) {
      //失败
      shiBaiYuanYin = rstObj.errMsg;
      tongBuZhuangTai = false;
    } else {
      //删除成功--更新潜在客户档案
      let rstObjList = rstObj.data.infoResponseList;
      if (rstObjList.length == 0) {
        shiBaiYuanYin = "富通返回删除结果为0";
        tongBuZhuangTai = false;
      } else {
        let custObj = rstObjList[0]; //获取客户档案信息对象解析数据
        if (custObj.state) {
          //更新潜在客户单据信息
          let biObj = { id: custId, tongBuZhuangTai: false, tongBuShiiJan: nowTimeStr, shiBaiYuanYin: "" };
          let biRes = ObjectStore.updateById(gsURI, biObj, billNo);
        } else {
          tongBuZhuangTai = false;
          shiBaiYuanYin = custObj.msg;
        }
      }
    }
    return { rst: tongBuZhuangTai, msg: shiBaiYuanYin };
  }
}
exports({ entryPoint: MyAPIHandler });