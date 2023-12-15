let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(requestData) {
    let { code, name, model, modelDescription } = requestData;
    let appContext = JSON.parse(AppContext());
    //获取接口配置信息
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    var tenantId = appContext.currentUser.tenantId;
    // 构建请求数据
    let timestamp = getTime();
    let ciphertext = SHA256Encode(timestamp + config.BASE.HT_TOKEN);
    let headParam = {
      timestamp: timestamp,
      ciphertext: ciphertext,
      "Content-Type": "application/json"
    };
    let cpartInfosList = [
      {
        //客户编码  待海棠提供
        customerCode: "SEED",
        origCustomerCode: model,
        origCustomerCodeDesc: modelDescription,
        cpartnumber: code,
        cpartnumberDesc: name
      }
    ];
    // 向HT发送请求
    let d = { Source_Channel: config.BASE.HT_SOURCE_CHANNEL, data: cpartInfosList };
    let url = config.BASE.HT_URL + "/cpart";
    let capacityStartDate = new Date();
    let headerJson = JSON.stringify(headParam);
    let bodyJson = JSON.stringify(d);
    let strResponse = postman("post", url, headerJson, bodyJson);
    let capacityEndDate = new Date();
    // 将接口信息同步至日志记录
    try {
      let logInfoData = {
        methodName: "编码传递接口同步",
        requestParams: bodyJson,
        requestTime: capacityStartDate.format("yyyy-MM-dd hh:mm:ss"),
        respResult: strResponse,
        respTime: capacityEndDate.format("yyyy-MM-dd hh:mm:ss"),
        errorMsg: "",
        url: url
      };
      let url2 = `https://c1.yonyoucloud.com/iuap-api-gateway/${tenantId}/product_ref/product_ref_01/insertLog`;
      let apiResponse2 = openLinker("POST", url2, "AT173E4CEE16E80007", JSON.stringify({ logObj: logInfoData }));
    } catch (e) {
      throw new Error(e);
    }
    return {};
  }
}
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() + 8, //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  // 根据y的长度来截取年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }
  return fmt;
};
function getTime() {
  var timezone = 8; //目标时区时间，东八区
  var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
  var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
  var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
  return date.getTime();
}
exports({ entryPoint: MyAPIHandler });