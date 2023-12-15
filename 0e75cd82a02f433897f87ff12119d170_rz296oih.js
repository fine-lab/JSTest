let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let logObjDetail = null;
    try {
      // 调用实体操作，对实体进行插入
      let objectDetails = [];
      let objectDetailDate = { predictionType: 0, wk01: "2023-01-13", wk02: "2023-01-20", wk03: "2023-01-27" };
      let objectDetailQty = { predictionType: 1, wk01: "100", wk02: "190", wk03: "300" };
      objectDetails.push(objectDetailDate);
      objectDetails.push(objectDetailQty);
      let object = {
        sdMaterialCode: "sku0015",
        sdCodeRemark: "test",
        sdCodeStatus: "开立",
        sdPeriod: "2023-01-23",
        predictionRegion: "1",
        sProductClassification: "2",
        status: "1",
        predictionApiInfoDetailList: objectDetails
      };
      // 日志对象构造
      logObjDetail = {
        methodName: "insertLocalDemandForecast",
        url: "AT173E4CEE16E80007",
        requestParams: JSON.stringify(objectDetails),
        requestTime: new Date().format("yyyy-MM-dd hh:mm:ss"),
        operationType: "insert"
      };
      //调用实体操作，对实体进行插入
      var res = ObjectStore.insert("AT170EA44616400003.AT170EA44616400003.predictionApiInfo", object, "yb170e3dc8");
      logObjDetail.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      logObjDetail.respResult = JSON.stringify(res);
      return res;
    } catch (error) {
      throw new Error(error);
    } finally {
      try {
        ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logObjDetail, "yb6b993e05");
      } catch (e) {
        // 日志写入报错，不做任何处理
        console.log("insertLocalDemandForecast接口日志写入异常");
      }
    }
    // 写入SSHL物料编码 和 物料分类
    // 调用实体操作，对实体进行插入
    // 得到10位数
    // 拿取物料编码
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