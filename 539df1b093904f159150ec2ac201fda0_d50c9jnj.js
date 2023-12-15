let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let ids = request.ids;
    let dataStatusHWList = []; // 更新数据状态
    let itemTypeMap = new Map(); // 获取形态，给SN信息赋值
    let sql = "select id,creation_date create_time,details.supplier_receives_ceg_time supplier_receives_ceg_time,details.po_confirm_time po_confirm_time,";
    sql += "details.po_activation_time po_activation_time,details.urgent_order_flag urgent_order_flag,details.supplier_feedback_cpd supplier_feedback_cpd,";
    sql += "details.supplier_feedback_esd supplier_feedback_esd,details.supplier_feedback_eta supplier_feedback_eta,details.supplier_explain supplier_explain,";
    sql += "details.supplier_feedback_apd_time supplier_feedback_apd_time,details.supplier_feedback_asd_time supplier_feedback_asd_time,details.supplier_feedback_ata_time supplier_feedback_ata_time,";
    sql += "details.waybill_no waybill_no,details.logistics_status logistics_status,details.logistics_transfer_time logistics_transfer_time,details.first_delivery_time first_delivery_time,";
    sql += "details.first_failure_reason first_failure_reason,details.logistics_sign_time logistics_sign_time,details.receipt_certificate_time receipt_certificate_time,";
    sql += "details.pubts pubts,details.production_schedule production_schedule,details.itemCode itemCode,details.poLineId poLineId,details.item_type item_type,details.poSendDate poSendDate ";
    sql += " from GT37595AT2.GT37595AT2.shippingschedule ";
    sql += " inner join 	GT37595AT2.GT37595AT2.shippingscheduleb details on details.shippingschedule_id = id ";
    sql += " where id in ('" + ids.join("','") + "')";
    let res = ObjectStore.queryByYonQL(sql);
    let uploadDataHWList = [];
    res.forEach((item) => {
      var uploadData = {
        computerSupplierReceivedInstructionsDate: item.create_time != null ? item.create_time : "2099-12-31 00:00:00",
        computerSupplierReceivedCegDate: item.supplier_receives_ceg_time != null ? item.supplier_receives_ceg_time : "2099-12-31 00:00:00",
        //推送s报文中增加ceg时间  chaigb
        supplierPoConfirmDate: item.po_confirm_time,
        supplierPoActivatingDate: item.po_activation_time,
        urgentOrder: item.urgent_order_flag,
        epd: item.supplier_feedback_cpd != null ? item.supplier_feedback_cpd : "2099-12-31 00:00:00",
        esd: item.supplier_feedback_esd != null ? item.supplier_feedback_esd : "2099-12-31 00:00:00",
        eta: item.supplier_feedback_eta != null ? item.supplier_feedback_eta : "2099-12-31 00:00:00",
        shortageRemark: item.supplier_explain,
        apd: item.supplier_feedback_apd_time,
        asd: item.supplier_feedback_asd_time,
        ata: item.supplier_feedback_ata_time,
        shipSet: item.waybill_no,
        status: item.logistics_status,
        logisticsArrivalTransferDate: item.logistics_transfer_time,
        firstDeliveryTime: item.first_delivery_time,
        firstDeliveryFailureCause: item.first_failure_reason,
        logisticsSigningTime: item.logistics_sign_time,
        uploadTimeOfSigningCertificate: item.receipt_certificate_time,
        computerSupplierDeliveryTime: item.poSendDate,
        productProgress: item.production_schedule,
        itemCode: item.itemCode,
        poLineId: item.poLineId,
        poNumber: item.item_type
      };
      uploadDataHWList.push(uploadData);
      if (!itemTypeMap.has(item.id)) {
        itemTypeMap.set(item.id, item.item_type);
        dataStatusHWList.push({ id: item.id, dataStatus: "4" });
      }
    });
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
    // 构造请求华为参数SN回复
    let configFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let config = configFunc.execute();
    let X_HW_ID = config.BASE.X_HW_ID;
    let X_HW_APPKEY = config.BASE.X_HW_APPKEY;
    let uploadReportForEmsUrl = config.BASE.URL + config.API_URL.uploadReportForEms;
    let header = {
      "X-HW-ID": X_HW_ID,
      "X-HW-APPKEY": X_HW_APPKEY
    };
    // 日志对象
    let body10Log = {
      methodName: "uploadReportForEms",
      requestParams: JSON.stringify(body10),
      url: uploadReportForEmsUrl,
      requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    let strResponse10 = postman("post", uploadReportForEmsUrl, JSON.stringify(header), JSON.stringify(body10));
    body10Log.respResult = JSON.stringify(strResponse10);
    body10Log.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    let hwres10 = JSON.parse(strResponse10);
    let resultData = { code: 200, message: "处理成功", data: {} };
    if (hwres10.resultCode == "200") {
      resultData["code"] = "200";
      resultData["message"] = "海棠回复要货指令数据成功";
      let updateStatusHWRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", dataStatusHWList, "02a3de71");
    } else {
      resultData["message"] = "调用华为接口失败";
      body10Log.errorMsg = hwres10.resultCode;
    }
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body10Log, "yb6b993e05");
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