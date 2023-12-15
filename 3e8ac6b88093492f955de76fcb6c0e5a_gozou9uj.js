let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let envUrl = ObjectStore.env().url;
    let logData = {
      methodName: "ReplyPurorder",
      requestParams: JSON.stringify(request),
      url: envUrl + "/iuap-api-gateway/rz296oih/product_ref/product_ref_01/ReplyPurorder",
      requestTime: new Date().format("yyyy-MM-dd hh:mm:ss")
    };
    let requestData = request.data;
    let count = 0;
    requestData.forEach((item, index) => {
      count += item.uploadDataList.length;
    });
    if (count >= 1000) {
      throw new Error("SN条目超过1000");
    }
    let reportList = [];
    let uploadDataHWList = [];
    var objectList = [];
    var shippingscheduleIdList = [];
    try {
      requestData.forEach((item, index) => {
        shippingscheduleIdList.push(item.group_id);
        let lineDataList = [];
        if (item.line_data.length > 0) {
          item.line_data.forEach((line, indexLine) => {
            let sql =
              "select *, main.createTime as create_time, main.id as mainId  from	GT37595AT2.GT37595AT2.shippingscheduleb left join GT37595AT2.GT37595AT2.shippingschedule main " +
              " on main.id = shippingschedule_id  where shippingschedule_id = '" +
              item.group_id +
              "'";
            var res = ObjectStore.queryByYonQL(sql);
            if (res.length == 0) {
              throw new Error("group_id" + item.group_id + "不存在");
            }
            for (var i in res) {
              if (!res[i].mainId) {
                throw new Error("要货计划主表不存在,请检查数据");
              }
              //构造更新要货计划子表的参数
              let shippingscheduleb = {};
              shippingscheduleb.poNumber = line.req_no;
              shippingscheduleb.poLineId = line.req_line_id;
              shippingscheduleb.batchNumber = line.batch;
              shippingscheduleb.po_confirm_time = line.po_confirm_time;
              shippingscheduleb.po_activation_time = line.po_activation_time;
              shippingscheduleb.urgent_order_flag = line.urgent_order_flag;
              shippingscheduleb.cpd = line.supplier_feedback_cpd;
              shippingscheduleb.esd = line.supplier_feedback_esd;
              shippingscheduleb.eta = line.supplier_feedback_eta;
              shippingscheduleb.supplier_explain = line.supplier_explain;
              shippingscheduleb.supplier_feedback_apd = line.supplier_feedback_apd;
              shippingscheduleb.supplier_feedback_asd = line.supplier_feedback_asd;
              shippingscheduleb.supplier_feedback_ata = line.supplier_feedback_ata;
              shippingscheduleb.waybill_no = line.waybill_no;
              shippingscheduleb.logistics_status = line.logistics_status;
              shippingscheduleb.logistics_transfer_time = line.logistics_transfer_time;
              shippingscheduleb.first_delivery_time = line.first_delivery_time;
              shippingscheduleb.first_failure_reason = line.first_failure_reason;
              shippingscheduleb.logistics_sign_time = line.logistics_sign_time;
              shippingscheduleb.receipt_certificate_time = line.receipt_certificate_time;
              shippingscheduleb.production_schedule = line.production_schedule;
              shippingscheduleb.id = res[i].id;
              shippingscheduleb._status = "Update";
              lineDataList.push(shippingscheduleb);
              var uploadData = {
                computerSupplierReceivedInstructionsDate: res[i].create_time || "",
                computerSupplierReceivedCegDate: "2023-03-21 12:00:22",
                supplierPoConfirmDate: line.po_confirm_time,
                supplierPoActivatingDate: line.po_activation_time,
                urgentOrder: line.urgent_order_flag,
                epd: line.supplier_feedback_cpd,
                esd: line.supplier_feedback_esd,
                eta: line.supplier_feedback_eta,
                shortageRemark: line.supplier_explain,
                apd: line.supplier_feedback_apd,
                asd: line.supplier_feedback_asd,
                ata: line.supplier_feedback_ata,
                shipSet: line.waybill_no,
                status: line.logistics_status,
                logisticsArrivalTransferDate: line.logistics_transfer_time,
                firstDeliveryTime: line.first_delivery_time,
                firstDeliveryFailureCause: line.first_failure_reason,
                logisticsSigningTime: line.logistics_sign_time,
                uploadTimeOfSigningCertificate: line.receipt_certificate_time,
                computerSupplierDeliveryTime: res[i].pubts,
                productProgress: line.production_schedule,
                itemCode: res[i].itemCode,
                poLineId: res[i].poLineId,
                poNumber: res[i].item_type
              };
              uploadDataHWList.push(uploadData);
            }
          });
        }
        //遍历SN信息
        let snList = [];
        if (item.uploadDataList.length > 0) {
          item.uploadDataList.forEach((lineSN, indexSN) => {
            reportList.push(lineSN);
            if (item.group_id) {
              let snsql = "select id, subpartSN, sncode from GT37595AT2.GT37595AT2.shippingscheduleSN where shippingschedule_id = " + item.group_id;
              var snres = ObjectStore.queryByYonQL(snsql);
              lineSN._status = "Insert";
              lineSN.sncode = lineSN.subpartSN;
              if (snres.length > 0) {
                for (var j in snres) {
                  if (snres[j].subpartSN == lineSN.subpartSN && snres[j].sncode == lineSN.subpartSN) {
                    lineSN._status = "Update";
                    lineSN.id = snres[j].id;
                    break;
                  }
                }
              }
              snList.push(lineSN);
            }
          });
        }
        let object = {
          id: item.group_id,
          shippingschedulebList: lineDataList,
          shippingscheduleSNList: snList
        };
        objectList.push(object);
      });
    } catch (e) {
      logData.errMsg = JSON.stringify(e);
      logData.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logData, "yb6b993e05");
      throw new Error(e);
    }
    let updateres = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", objectList, "02a3de71");
    logData.respResult = JSON.stringify(updateres);
    logData.respTime = new Date().format("yyyy-MM-dd hh:mm:ss");
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logData, "yb6b993e05");
    } catch (e) {}
    //处理数据状态
    let dataStatusList = [];
    let dataStatusHWList = [];
    for (var k in shippingscheduleIdList) {
      let dataStatusMap = {
        id: shippingscheduleIdList[k],
        dataStatus: "3"
      };
      let dataStatusHWMap = {
        id: shippingscheduleIdList[k],
        dataStatus: "4"
      };
      dataStatusList.push(dataStatusMap);
      dataStatusHWList.push(dataStatusHWMap);
    }
    let updateStatusRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", dataStatusList, "02a3de71");
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