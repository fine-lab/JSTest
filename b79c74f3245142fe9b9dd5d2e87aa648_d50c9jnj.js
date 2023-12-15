let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.replyData;
    let totalBatchSize = data.totalBatchSize;
    let batchNumber = data.batchNumber;
    let currentBatchNo = data.currentBatchNo;
    let totalNumSS = data.totalNumSS;
    let shippingschedulebList = data.shippingschedulebList;
    let shippingscheduleSNList = data.shippingscheduleSNList;
    let reportList = [];
    if (shippingscheduleSNList.length > 0) {
      for (var j = 0; j < shippingscheduleSNList.length; j++) {
        let sn = {
          applyNo: shippingschedulebList[0].item_type,
          parentSn: shippingscheduleSNList[j].parentSn,
          deliveryBatchNumber: shippingscheduleSNList[j].deliveryBatchNumber,
          finalParentPNDesc: shippingscheduleSNList[j].finalParentPNDesc,
          aParentFixedCapitalNumber: shippingscheduleSNList[j].aParentFixedCapitalNumber,
          sampleType: shippingscheduleSNList[j].sampleType,
          plNo: shippingscheduleSNList[j].plNo,
          supplierParentCode: shippingscheduleSNList[j].supplierParentCode,
          afinalParentCode: shippingscheduleSNList[j].afinalParentCode,
          subSampleDesc: shippingscheduleSNList[j].subSampleDesc,
          level: shippingscheduleSNList[j].level,
          vendorFinalParentCode: shippingscheduleSNList[j].vendorFinalParentCode,
          afinalParentPN: shippingscheduleSNList[j].afinalParentPN,
          deviceVendor: shippingscheduleSNList[j].deviceVendor,
          subSamplePn: shippingscheduleSNList[j].subSamplePn,
          aSubPartsMaterialCode: shippingscheduleSNList[j].aSubPartsMaterialCode,
          subpartSN: shippingscheduleSNList[j].subpartSN,
          supplierParentSN: shippingscheduleSNList[j].supplierParentSN,
          supplierSubSampleCode: shippingscheduleSNList[j].supplierSubSampleCode,
          aParentCode: shippingscheduleSNList[j].aParentCode,
          aSubSampleCode: shippingscheduleSNList[j].aSubSampleCode,
          subSampleVendorSn: shippingscheduleSNList[j].subSampleVendorSn,
          upos: shippingscheduleSNList[j].upos
        };
        reportList.push(sn);
      }
    }
    //构造请求华为参数SN回复
    let body11 = {
      totalBatchSize: totalBatchSize,
      batchNumber: batchNumber,
      currentBatchNo: currentBatchNo,
      reportType: "11",
      reportContent: {
        vendorSiteCode: "CNY0001",
        unitCode: "2821",
        invOrgId: "yourIdHere",
        uploadDataList: reportList
      }
    };
    let configFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let config = configFunc.execute();
    let X_HW_ID = config.BASE.X_HW_ID;
    let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
    let uploadReportForEmsUrl = config.BASE.URL + config.API_URL.uploadReportForEms;
    let header = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY
    };
    let body11Log = {
      methodName: "uploadReportShipSnForEms",
      requestParams: JSON.stringify(body11),
      url: uploadReportForEmsUrl,
      requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    let strResponse11 = postman("post", uploadReportForEmsUrl, JSON.stringify(header), JSON.stringify(body11));
    body11Log.respResult = JSON.stringify(strResponse11);
    body11Log.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let hwres11 = JSON.parse(strResponse11);
    let resultData = {
      code: 200,
      message: "处理成功",
      data: {}
    };
    if (hwres11.resultCode == "200") {
      resultData["code"] = "200";
      resultData["message"] = "海棠回复要货指令数据成功";
    } else {
      resultData["code"] = hwres11.resultCode;
      resultData["message"] = "调用华为接口失败";
      body11Log.errorMsg = hwres11.resultCode;
    }
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body11Log, "yb6b993e05");
    } catch (e) {}
    return resultData;
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