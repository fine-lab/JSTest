let AbstractTrigger = require("AbstractTrigger");
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
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //通过接口检测U8上凭证是否删除，未删除则不可操作，U8中没有的凭证方可删除
    let LogToDB = true;
    let pdata = param.data[0];
    let id = pdata.id;
    let voucherIdU8 = pdata.voucherIdU8;
    let voucherCodeU8 = pdata.voucherCodeU8;
    let displayName = pdata.displayName;
    let voucherCode = pdata.voucherCode;
    let syncFailure = pdata.syncFailure;
    let makeTime = pdata.makeTime;
    if (makeTime.length > 10) {
      makeTime = makeTime.substring(0, 10);
    }
    let DEBUG = true;
    if (DEBUG) {
      return;
    }
    if (voucherIdU8 == undefined || voucherIdU8 == null || voucherIdU8 == "") {
      //尚未同步到U8--可以直接删除
    }
    if ((!syncFailure || syncFailure != "success") && !pdata.syncRst) {
    }
    let funcRes = extrequire("AT1703B12408A00002.selfServ.getAccessToken").execute(null);
    let accessToken = null;
    if (funcRes.rst) {
      accessToken = funcRes.accessToken;
    }
    if (accessToken == null || accessToken == "") {
      extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: "AccessToken为空异常-无法对接U8", reqt: "", resp: "" })); //调用领域内函数写日志
      throw new Error("AccessToken为空异常-无法对接U8，不能删除!");
      return;
    }
    let u8Domain = getU8Domain("voucherlist/batch_get");
    let baseDataType = "获取凭证列表信息";
    let cno_id = voucherIdU8;
    let coutno_id = voucherCodeU8; //外部系统编码
    let commUrl = u8Domain + "?from_account=" + funcRes.from_account + "&to_account=" + funcRes.to_account + "&app_key=" + funcRes.app_key + "&token=" + funcRes.accessToken;
    commUrl = commUrl + "&page_index=1&rows_per_page=10";
    if (coutno_id) {
      //有外部系统编号就以此为条件查询
      commUrl = commUrl + "&coutno_id=" + coutno_id;
    } else {
      //否则以日期和凭证ID进行查询--凭证id可能会变-存在不准确风险
      commUrl = commUrl + "&bill_date_from=" + makeTime + "&bill_date_to=" + makeTime + "&cno_id=" + cno_id;
    }
    let commResp = postman("get", commUrl, JSON.stringify({ "Content-Type": "application/json;charset=UTF-8" }), JSON.stringify({}));
    let rstObj = JSON.parse(commResp);
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logModule: 99, description: baseDataType, reqt: commUrl, resp: commResp }));
    if (rstObj.errcode != 0) {
      throw new Error("凭证:" + displayName + "[" + voucherCode + "]检测U8接口失败，请重试![" + rstObj.errmsg + "]");
    }
    if (rstObj.voucherlist.entry.length > 0) {
      throw new Error("凭证:" + displayName + "[" + voucherCode + "]已同步到U8，不能删除!");
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });