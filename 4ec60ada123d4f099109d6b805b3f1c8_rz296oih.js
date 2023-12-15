let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(requestData) {
    let { code, name, model, modelDescription } = requestData;
    let appContext = JSON.parse(AppContext());
    var tenantId = appContext.currentUser.tenantId;
    // 构建请求数据
    let timestamp = Date.parse(new Date());
    let ciphertext = SHA256Encode(timestamp + "mMy6G");
    let headParam = {
      timestamp: timestamp,
      ciphertext: ciphertext,
      "Content-Type": "application/json"
    };
    let cpartInfosList = [
      {
        //客户编码  待海棠提供
        customerCode: "SEED",
        cpartnumber: code,
        cpartnumberDesc: name
      }
    ];
    // 向HT发送请求
    let d = { Source_Channel: "SS", data: cpartInfosList };
    let env = tenantId === "rz296oih" ? "test" : "pro";
    let url = `https://apig.xfusion.com/api/SSHL/${env}/cpart`;
    let capacityStartDate = new Date();
    let strResponse = postman("post", url, JSON.stringify(headParam), JSON.stringify(d));
    let capacityEndDate = new Date();
    try {
      let logInfoData = {
        methodName: "编码传递接口(single)",
        requestParams: JSON.stringify(d),
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
exports({ entryPoint: MyAPIHandler });