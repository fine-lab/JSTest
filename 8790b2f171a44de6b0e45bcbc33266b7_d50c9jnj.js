let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.replyData;
    let shippingschedulebList = data.shippingschedulebList;
    let shippingscheduleSNList = data.shippingscheduleSNList;
    let uploadDataHWList = [];
    let reportList = [];
    if (shippingschedulebList.length > 0) {
      for (var i = 0; i < shippingschedulebList.length; i++) {
        var uploadData = {
          computerSupplierReceivedInstructionsDate: data.creation_date != null ? data.creation_date : "2099-12-31 00:00:00",
          computerSupplierReceivedCegDate: shippingschedulebList[i].supplier_receives_ceg_time != null ? shippingschedulebList[i].supplier_receives_ceg_time : "2099-12-31 00:00:00",
          //推送s报文中增加ceg时间  chaigb
          supplierPoConfirmDate: shippingschedulebList[i].po_confirm_time,
          supplierPoActivatingDate: shippingschedulebList[i].po_activation_time,
          urgentOrder: shippingschedulebList[i].urgent_order_flag,
          epd: shippingschedulebList[i].supplier_feedback_cpd != null ? shippingschedulebList[i].supplier_feedback_cpd : "2099-12-31 00:00:00",
          esd: shippingschedulebList[i].supplier_feedback_esd != null ? shippingschedulebList[i].supplier_feedback_esd : "2099-12-31 00:00:00",
          eta: shippingschedulebList[i].supplier_feedback_eta != null ? shippingschedulebList[i].supplier_feedback_eta : "2099-12-31 00:00:00",
          shortageRemark: shippingschedulebList[i].supplier_explain,
          apd: shippingschedulebList[i].supplier_feedback_apd_time,
          asd: shippingschedulebList[i].supplier_feedback_asd_time,
          ata: shippingschedulebList[i].supplier_feedback_ata_time,
          shipSet: shippingschedulebList[i].waybill_no,
          status: shippingschedulebList[i].logistics_status,
          logisticsArrivalTransferDate: shippingschedulebList[i].logistics_transfer_time,
          firstDeliveryTime: shippingschedulebList[i].first_delivery_time,
          firstDeliveryFailureCause: shippingschedulebList[i].first_failure_reason,
          logisticsSigningTime: shippingschedulebList[i].logistics_sign_time,
          uploadTimeOfSigningCertificate: shippingschedulebList[i].receipt_certificate_time,
          computerSupplierDeliveryTime: shippingschedulebList[i].poSendDate,
          productProgress: shippingschedulebList[i].production_schedule,
          itemCode: shippingschedulebList[i].itemCode,
          poLineId: shippingschedulebList[i].poLineId,
          poNumber: shippingschedulebList[i].item_type
        };
        uploadDataHWList.push(uploadData);
      }
    }
    if (shippingscheduleSNList.length > 0) {
      for (var j = 0; j < shippingscheduleSNList.length; j++) {
        let sn = {
          applyNo: shippingschedulebList[0].applyNo,
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
    //构造请求华为参数供应商回复
    let body10 = {
      reportType: "10",
      batchNumber: uuid(),
      reportContent: {
        vendorSiteCode: "CNY0001",
        unitCode: "2821",
        invOrgId: "yourIdHere",
        uploadDataList: uploadDataHWList
      }
    };
    //构造请求华为参数SN回复
    let body11 = {
      reportType: "11",
      batchNumber: uuid(),
      reportContent: {
        vendorSiteCode: "CNY0001",
        unitCode: "2821",
        invOrgId: "yourIdHere",
        uploadDataList: reportList
      }
    };
    //处理数据状态
    let dataStatusHWList = [];
    let dataStatusHWMap = {
      id: data.id,
      dataStatus: "4"
    };
    dataStatusHWList.push(dataStatusHWMap);
    let configFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let config = configFunc.execute();
    let X_HW_ID = config.BASE.X_HW_ID;
    let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
    let uploadReportForEmsUrl = config.BASE.URL + config.API_URL.uploadReportForEms;
    let header = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY
    };
    let body10Log = {
      methodName: "uploadReportForEms",
      requestParams: JSON.stringify(body10),
      url: uploadReportForEmsUrl,
      requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    let strResponse10 = postman("post", uploadReportForEmsUrl, JSON.stringify(header), JSON.stringify(body10));
    body10Log.respResult = JSON.stringify(strResponse10);
    body10Log.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let body11Log = {
      methodName: "uploadReportForEms",
      requestParams: JSON.stringify(body11),
      url: uploadReportForEmsUrl,
      requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    let strResponse11 = postman("post", uploadReportForEmsUrl, JSON.stringify(header), JSON.stringify(body11));
    body11Log.respResult = JSON.stringify(strResponse11);
    body11Log.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let hwres10 = JSON.parse(strResponse10);
    let hwres11 = JSON.parse(strResponse11);
    let resultData = { code: 200, message: "处理成功", data: {} };
    if (hwres10.resultCode == "200" && hwres11.resultCode == "200") {
      resultData["code"] = "200";
      resultData["message"] = "海棠回复要货指令数据成功";
      let updateStatusHWRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", dataStatusHWList, "02a3de71");
    } else {
      resultData["code"] = hwres11.resultCode;
      resultData["message"] = "调用华为接口失败";
      body10Log.errorMsg = hwres10.resultCode;
      body11Log.errorMsg = hwres11.resultCode;
    }
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body10Log, "yb6b993e05");
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