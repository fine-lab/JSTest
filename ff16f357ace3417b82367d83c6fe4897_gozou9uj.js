let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = AppContext();
    var resJson = JSON.parse(res);
    var tenantId = resJson.currentUser.tenantId;
    let envUrl = ObjectStore.env().url;
    let logData = {
      methodName: "ReplyPurorder",
      requestParams: JSON.stringify(request),
      url: envUrl + "/iuap-api-gateway/" + tenantId + "/product_ref/product_ref_01/ReplyPurorder",
      requestTime: getDate()
    };
    let requestData = request.data;
    let reportList = [];
    let uploadDataHWList = [];
    var objectList = [];
    var shippingscheduleIdList = [];
    // 要货计划主表设置,供应商反馈时间 supplier_feedback_time
    let supplierFeedbackTime = getDate();
    try {
      requestData.forEach((item, index) => {
        shippingscheduleIdList.push(item.group_id);
        let dataStatuRely = "";
        let lineDataList = [];
        // 根据group_id 即要货计划主表的id查询 子表的内容
        let sql =
          "select *, main.creation_date as create_time, main.id as mainId  from	GT37595AT2.GT37595AT2.shippingscheduleb left join GT37595AT2.GT37595AT2.shippingschedule main " +
          " on main.id = shippingschedule_id  where shippingschedule_id = '" +
          item.group_id +
          "'";
        var res = ObjectStore.queryByYonQL(sql);
        if (item.line_data.length > 0) {
          item.line_data.forEach((line, indexLine) => {
            if (res.length == 0) {
              throw new Error("group_id" + item.group_id + "不存在");
            }
            if (!dataStatuRely && line.supplier_feedback_cpd) {
              dataStatuRely = "5"; // 预计交期回复
            }
            if (line.supplier_feedback_apd) {
              dataStatuRely = "6"; // 实际交期回复
            }
            for (var i in res) {
              if (!res[i].mainId) {
                throw new Error("要货计划主表不存在,请检查数据");
              }
              //构造更新要货计划子表的参数
              let shippingscheduleb = {};
              shippingscheduleb.po_confirm_time = line.po_confirm_time;
              shippingscheduleb.po_activation_time = line.po_activation_time;
              shippingscheduleb.supplier_po_activation_time = line.supplier_po_activation_time;
              shippingscheduleb.urgent_order_flag = line.urgent_order_flag;
              shippingscheduleb.supplier_feedback_cpd = line.supplier_feedback_cpd;
              shippingscheduleb.supplier_feedback_esd = line.supplier_feedback_esd;
              shippingscheduleb.supplier_feedback_eta = line.supplier_feedback_eta;
              shippingscheduleb.supplier_explain = line.supplier_explain;
              shippingscheduleb.supplier_feedback_apd = line.supplier_feedback_apd;
              shippingscheduleb.supplier_feedback_asd = line.supplier_feedback_asd;
              shippingscheduleb.supplier_feedback_apd_time = line.supplier_feedback_apd;
              shippingscheduleb.supplier_feedback_asd_time = line.supplier_feedback_asd;
              if (res[i].deviceSupplier != "SS" && res[i].deviceSupplier != "ZR") {
                shippingscheduleb.supplier_feedback_ata = line.supplier_feedback_ata;
                shippingscheduleb.supplier_feedback_ata_time = line.supplier_feedback_ata;
              }
              shippingscheduleb.waybill_no = line.waybill_no;
              shippingscheduleb.logistics_transfer_time = line.logistics_transfer_time;
              shippingscheduleb.first_delivery_time = line.first_delivery_time;
              shippingscheduleb.first_failure_reason = line.first_failure_reason;
              shippingscheduleb.production_schedule = line.production_schedule;
              shippingscheduleb.itemCount = line.product_count;
              shippingscheduleb.itemWeight = line.product_weight;
              shippingscheduleb.itemVolume = line.product_volume;
              shippingscheduleb.id = res[i].id;
              shippingscheduleb._status = "Update";
              lineDataList.push(shippingscheduleb);
              // 根据下游供应商返回的数据构造推送S的接口数据
              var uploadData = {
                computerSupplierReceivedInstructionsDate: res[i].create_time != null ? res[i].create_time : "2099-12-31 00:00:00",
                computerSupplierReceivedCegDate: "",
                supplierPoConfirmDate: line.po_confirm_time,
                supplierPoActivatingDate: line.po_activation_time,
                urgentOrder: line.urgent_order_flag,
                epd: line.supplier_feedback_cpd != null ? line.supplier_feedback_cpd : "2099-12-31 00:00:00",
                esd: line.supplier_feedback_esd != null ? line.supplier_feedback_esd : "2099-12-31 00:00:00",
                eta: line.supplier_feedback_eta != null ? line.supplier_feedback_eta : "2099-12-31 00:00:00",
                shortageRemark: line.supplier_explain,
                apd: line.supplier_feedback_apd,
                asd: line.supplier_feedback_asd,
                ata: line.supplier_feedback_ata,
                shipSet: line.waybill_no,
                status: line.logistics_status,
                logisticsArrivalTransferDate: line.logistics_transfer_time,
                firstDeliveryTime: line.first_delivery_time,
                firstDeliveryFailureCause: line.first_failure_reason,
                logisticsSigningTime: "",
                uploadTimeOfSigningCertificate: line.receipt_certificate_time,
                computerSupplierDeliveryTime: res[i].poSendDate,
                productProgress: line.production_schedule,
                itemCode: res[i].itemCode,
                poLineId: res[i].poLineId,
                poNumber: res[i].item_type,
                supplierFeedbackTime: supplierFeedbackTime
              };
              if (res[i].deviceSupplier == "SS" || res[i].deviceSupplier == "ZR") {
                uploadData["ata"] = res[i].supplier_feedback_ata_time || "";
              }
              uploadDataHWList.push(uploadData);
            }
          });
        }
        //遍历SN信息
        let snList = [];
        if (item.uploadDataList.length > 0) {
          let snres = [];
          if (item.group_id) {
            let snsql = "select id, subpartSN, sncode,supplierParentSN,pid from GT37595AT2.GT37595AT2.shippingscheduleSN where shippingschedule_id = " + item.group_id;
            snres = ObjectStore.queryByYonQL(snsql);
          }
          item.uploadDataList.forEach((lineSN, indexSN) => {
            if (res.length > 0) {
              lineSN.applyNo = res[0].item_type;
            }
            reportList.push(lineSN);
            if (item.group_id) {
              lineSN._status = "Insert";
              lineSN.sncode = lineSN.subpartSN;
              lineSN.temp = lineSN.aParentCode;
              lineSN.aParentCode = lineSN.supplierParentCode;
              lineSN.supplierParentCode = lineSN.temp;
              delete lineSN.temp;
              if (snres.length > 0) {
                for (var j in snres) {
                  if (lineSN.pid && snres[j].pid == lineSN.pid) {
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
          dataStatus: "3",
          supplier_feedback_time: supplierFeedbackTime,
          shippingschedulebList: lineDataList,
          shippingscheduleSNList: snList
        };
        if (snList.length > 0) {
          object["dataStatus"] = "7"; // sn信息回复
        } else if (dataStatuRely) {
          object["dataStatus"] = dataStatuRely;
        }
        objectList.push(object);
      });
    } catch (e) {
      logData.errMsg = JSON.stringify(e);
      logData.respTime = getDate();
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logData, "yb6b993e05");
      throw new Error(e);
    }
    let updateres = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", objectList, "02a3de71");
    logData.respResult = JSON.stringify(updateres);
    logData.respTime = getDate();
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logData, "yb6b993e05");
    } catch (e) {}
    //处理数据状态
    let dataStatusList = [];
    let dataStatusHWList = [];
    for (var k in shippingscheduleIdList) {
      let dataStatusHWMap = {
        id: shippingscheduleIdList[k],
        dataStatus: "4"
      };
      dataStatusHWList.push(dataStatusHWMap);
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
    if (reportList.length > 0) {
      reportList.forEach((lineSN, indexSN) => {
        delete lineSN._status;
        delete lineSN.sncode;
        delete lineSN.temp;
        delete lineSN.id;
      });
    }
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
      requestTime: getDate()
    };
    let strResponse10 = postman("post", uploadReportForEmsUrl, JSON.stringify(header), JSON.stringify(body10));
    body10Log.respResult = JSON.stringify(strResponse10);
    body10Log.respTime = getDate();
    let body11Log = {
      methodName: "uploadReportForEms",
      requestParams: JSON.stringify(body11),
      url: uploadReportForEmsUrl,
      requestTime: getDate()
    };
    let hwres10 = JSON.parse(strResponse10);
    let resultData = {
      code: 200,
      message: "处理成功",
      data: {}
    };
    if (hwres10.resultCode == "200") {
      resultData["code"] = "200";
      resultData["message"] = "供应商回复要货指令数据成功";
    } else {
      resultData["code"] = hwres10.resultCode;
      resultData["message"] = "调用华为接口失败";
      body10Log.errorMsg = hwres10.resultCode;
    }
    try {
      ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", body10Log, "yb6b993e05");
    } catch (e) {}
    return resultData;
    function getDate() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      var timeStr = date.getFullYear() + "-";
      if (date.getMonth() < 9) {
        // 月份从0开始的
        timeStr += "0";
      }
      timeStr += date.getMonth() + 1 + "-";
      timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      timeStr += " ";
      timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      timeStr += ":";
      timeStr += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      timeStr += ":";
      timeStr += date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return timeStr;
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
exports({ entryPoint: MyAPIHandler });