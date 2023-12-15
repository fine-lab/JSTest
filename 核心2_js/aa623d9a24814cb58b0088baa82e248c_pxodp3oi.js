let AbstractAPIHandler = require("AbstractAPIHandler");
const getU8Domain = (keyParams) => {
  let U8DOMAIN = "https://www.example.com/";
  return U8DOMAIN + keyParams;
};
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
const getPeriodObj = (periodList, periodCode) => {
  for (var i in periodList) {
    let periodObj = periodList[i];
    if (periodObj.code == periodCode) {
      return periodObj;
    }
  }
  return periodList[0];
};
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let LogToDB = true;
    let publicFlag = "【记】";
    var obj = JSON.parse(AppContext());
    var tid = obj.currentUser.tenantId;
    let voucherIds = request.voucherIds;
    let voucherIdList = voucherIds.split(",");
    let DOMAIN = extrequire("GT3734AT5.ServiceFunc.getDomain").execute(null, null);
    let periodResp = openLinker("POST", DOMAIN + "/yonbip/fi/fipub/basedoc/querybd/accperiod", "AT1703B12408A00002", null);
    let periodMap = new Map();
    let periodRespObj = JSON.parse(periodResp);
    let periodObjs = periodRespObj.data;
    for (var j in periodObjs) {
      let periodObj = periodObjs[j];
      periodMap.set(periodObj.code, periodObj);
    }
    let successCount = 0;
    for (var i in voucherIdList) {
      let voucherId = voucherIdList[i];
      let voucherSql = "select *,accBook.code from AT1703B12408A00002.AT1703B12408A00002.voucherSync where id='" + voucherId + "'";
      let voucherRst = ObjectStore.queryByYonQL(voucherSql, "developplatform");
      let voucherObj = voucherRst[0];
      let coutno_id = voucherObj.voucherCodeU8;
      if (!coutno_id || coutno_id == "") {
        return { rst: false, msg: "外部系统号coutno_id为空异常-无法从U8更新，请联系管理员" };
      }
      let maketime = voucherObj.makeTime;
      let accBookCode = voucherObj.accBook_code; //从U8获取对应的凭证信息
      let dsSequenceObj = extrequire("AT1703B12408A00002.selfServ.getU8dsSequence").execute(null, { accbookCode: accBookCode });
      let ds_sequence = 1; //注册账号都是1
      let ds_AppKey = dsSequenceObj.AppKey;
      let ds_AppSecret = dsSequenceObj.AppSecret;
      let ds_AppToken = dsSequenceObj.AppToken;
      let ds_paramExpiryTime = dsSequenceObj.paramExpiryTime;
      let ds_id = dsSequenceObj.id;
      let accessToken = null;
      let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccNewToken").execute(null, { id: ds_id });
      if (funcRes.rst) {
        accessToken = funcRes.accessToken;
      }
      if (accessToken == null || accessToken == "") {
        extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "3-AccessToken为空异常-无法对接U8", reqt: "", resp: "" })); //调用领域内函数写日志
        return { rst: false, msg: "AccessToken为空异常-无法对接U8" };
      }
      let u8Domain = getU8Domain("voucherlist/batch_get");
      let getOutNoUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
      getOutNoUrl = getOutNoUrl + "&page_index=1&rows_per_page=10&coutno_id=" + coutno_id + "&ds_sequence=" + ds_sequence;
      let getOutNoResp = postman("get", getOutNoUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({}));
      let getOutNoRespObj = JSON.parse(getOutNoResp);
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "10-传递凭证后获取凭证信息", reqt: getOutNoUrl, resp: getOutNoResp }));
      if (getOutNoRespObj.errcode == 0) {
        let voucherlist = getOutNoRespObj.voucherlist.entry;
        if (voucherlist.length > 0) {
          voucherObj.voucherCodeU8 = voucherlist[0].coutno_id; //外部系统号
          voucherObj.voucherIdU8 = voucherlist[0].ino_id; //凭证号
          voucherObj.syncRst = voucherObj.syncRst == 1 || voucherObj.syncRst === true ? true : false;
          ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", voucherObj, "ybf4caba5e");
          return { rst: true, successCount: 1, failCount: 0 };
        } else {
          //为空
          voucherObj.syncRst = false;
          voucherObj.syncFailure = "U8中查不到该凭证，疑似已被删除,已解除同步状态";
          ObjectStore.updateById("AT1703B12408A00002.AT1703B12408A00002.voucherSync", voucherObj, "ybf4caba5e");
          return { rst: false, msg: "凭证在U8中没查到", syncReqt: "", syncResp: "" };
        }
      } else {
        return { rst: false, msg: "从U8获取凭证信息异常：" + getOutNoRespObj.errmsg };
      }
    }
    return { rst: true, successCount: 1, failCount: 0 };
  }
}
exports({ entryPoint: MyAPIHandler });