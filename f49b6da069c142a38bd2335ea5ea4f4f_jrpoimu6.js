let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let appContext = JSON.parse(AppContext());
    var tenantId = appContext.currentUser.tenantId;
    //全量获取所有的物料数据
    let querySql = `select code,name,model,modelDescription from pc.product.Product order by code LIMIT 0,100`;
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    // 构建请求数据
    //获取接口配置信息
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let timestamp = Date.parse(new Date());
    let ciphertext = SHA256Encode(timestamp + config.BASE.HT_TOKEN);
    let headParam = {
      timestamp: timestamp,
      ciphertext: ciphertext,
      "Content-Type": "application/json"
    };
    let cpartInfosList = [];
    for (let item of res) {
      cpartInfosList.push({
        //客户编码  待海棠提供
        customerCode: "SEED",
        origCustomerCode: item.model,
        origCustomerCodeDesc: item.modelDescription,
        cpartnumber: item.code,
        cpartnumberDesc: item.name
      });
    }
    let d = { Source_Channel: config.BASE.HT_SOURCE_CHANNEL, data: cpartInfosList };
    let url = config.BASE.HT_URL + "/cpart";
    let capacityStartDate = new Date();
    let strResponse = postman("post", url, JSON.stringify(headParam), JSON.stringify(d));
    let capacityEndDate = new Date();
    // 将接口信息同步至日志记录
    try {
      let logInfoData = {
        methodName: "编码传递接口(ALL)",
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
exports({ entryPoint: MyTrigger });