let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //处理日期
    let dateFormat = function (value, format) {
      let times = value.getTime() + 8 * 60 * 60 * 1000;
      let date = new Date(times);
      var o = {
        "M+": date.getMonth() + 1, //month
        "d+": date.getDate(), //day
        "H+": date.getHours(), //hour+8小时
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        S: date.getMilliseconds() //millisecond
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      return format;
    };
    //是否gsp类型
    let gspType = 0;
    //发起下推单据类型
    let billsType = request.billsType;
    //发起下推单据的子表物料信息
    let materialList = request.materialList;
    let functionName = "";
    let udiList = request.udiList;
    let dataList = {};
    let body = {};
    let url = "";
    let trackingDirection = "去向";
    let billName = "外部来源";
    let billCode = "";
    let apiPreAndAppCode = extrequire("I0P_UDI.publicFunction.getApiPreAndApp").execute();
    if (materialList == undefined || materialList == null || materialList.length == 0) {
      throw new Error("没有下推的数据!");
    }
    //非gsp单据类型下推
    if (billsType == 2) {
      //采购到货下推入库单
      functionName = "savePurchaseCheck";
      billName = "采购到货下推入库";
      billCode = materialList[0].billCode;
      let sql = "select extend_is_gsp  from pu.arrivalorder.ArrivalOrder  where code=" + billCode;
      result = ObjectStore.queryByYonQL(sql, "upu");
      gspType = result[0].extend_is_gsp;
      url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/purinrecord/mergeSourceData/save";
      if (gspType != 1) {
        for (let i = 0; i < materialList.length; i++) {
          //通过区分仓库进行分单
          let data = dataList[materialList[i].warehouse];
          if (data != null && data != undefined) {
          } else {
            data = {};
            data.mergeSourceData = true;
            data.bustype = "A30002";
            data._status = "Insert";
            data.purInRecords = [];
            data.warehouse = materialList[i].warehouse;
            dataList[data.warehouse] = data;
          }
          data.purInRecords.push(materialList[i]);
        }
      } else {
        let purchaseData = {};
        purchaseData.purchaseOrderId = materialList[0].sourceid;
        purchaseData.detail = materialList;
        body.purchaseData = purchaseData;
      }
    } else if (billsType == 3) {
      //发货单下推出库单
      functionName = "saveSaleOutCheck";
      billName = "销售发货下推出库";
      billCode = materialList[0].billCode;
      let sql = "select extendGspType from 	voucher.delivery.DeliveryVoucher where code=" + billCode;
      result = ObjectStore.queryByYonQL(sql, "udinghuo");
      gspType = result[0].extendGspType;
      url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/salesout/mergeSourceData/save";
      if (gspType != 1) {
        for (let i = 0; i < materialList.length; i++) {
          //通过区分仓库进行分单
          let data = dataList[materialList[i].warehouse];
          if (data != null && data != undefined) {
          } else {
            data = {};
            data.mergeSourceData = true;
            data.bustype = "A30001";
            data._status = "Insert";
            data.details = [];
            data.warehouse = materialList[i].warehouse;
            dataList[data.warehouse] = data;
          }
          data.details.push(materialList[i]);
        }
      } else {
        let deliveryData = {};
        deliveryData.deliveryOrderId = materialList[0].sourceid;
        deliveryData.detail = materialList;
        body.deliveryData = deliveryData;
      }
    } else if (billsType == 7) {
      //完工报告下推产品入库
      for (let i = 0; i < materialList.length; i++) {
        //通过区分仓库进行分单
        let data = dataList[materialList[i].warehouse];
        if (data != null && data != undefined) {
        } else {
          data = {};
          data.resubmitCheckKey = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
          data.mergeSourceData = true;
          data.vouchdate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
          data.bustype = "A18001";
          data._status = "Insert";
          data.storeProRecords = [];
          data.warehouse = materialList[i].warehouse;
          dataList[data.warehouse] = data;
        }
        data.storeProRecords.push(materialList[i]);
      }
      billName = "完工报告下推产品入库";
      billCode = materialList[0].billCode;
      url = apiPreAndAppCode.apiPrefix + "/yonbip/scm/storeprorecord/mergeSourceData/save";
    }
    let successCode = "";
    let message = "";
    if (gspType != 1) {
      let dataKeys = Object.keys(dataList);
      for (let i = 0; i < dataKeys.length; i++) {
        body.data = dataList[dataKeys[i]];
        let apiResponse = openLinker("POST", url, apiPreAndAppCode.appCode, JSON.stringify(body));
        let res = JSON.parse(apiResponse);
        if (res.code == "200" && (typeof res.data.sucessCount == "undefined" || res.data.sucessCount > 0)) {
          if (res.data.infos != undefined) {
            successCode += res.data.infos[0].code + ",";
          } else {
            successCode += res.data.code + ",";
          }
        }
        if (res.data != undefined) {
          message += res.data.messages + ";";
        } else {
          message += res.message + ";";
        }
      }
      if (successCode == "") {
        throw new Error(message);
      }
    } else {
      body.tenantId = apiPreAndAppCode.tenantId;
      var strResponse = postman("post", apiPreAndAppCode.gspApiRestPre + "/gsp/" + functionName, null, JSON.stringify(body));
      return { result: "" };
    }
    let scanRecordLogList = [];
    let udiTrack = [{ _status: "Insert", trackingDirection: trackingDirection, billName: billName, billNo: billCode }];
    udiTrack[0].createTime = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    udiTrack[0].optDate = dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    let udiNeedReleases = [];
    for (let i = 0; i < udiList.length; i++) {
      //查询UDI数据中心是否有数据
      let UDIFileInfo = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: udiList[i].UDI });
      udiTrack[0].material = udiList[i].material;
      udiTrack[0].qty = udiList[i].qty;
      udiTrack[0].unit = udiList[i].unit;
      if (UDIFileInfo == null || UDIFileInfo.length == 0) {
      } else {
        UDIFileInfo[0].UDITrackv3List = udiTrack;
        ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", UDIFileInfo[0], "821f4590");
      }
      let scanRecordLog = {};
      scanRecordLog.udi = udiList[i].UDI;
      scanRecordLog._status = "Insert";
      scanRecordLog.packagingPhase = udiList[i].packagingPhase;
      scanRecordLog.packageIdentification = udiList[i].packageIdentification;
      scanRecordLog.scanDate = udiList[i].createTime;
      scanRecordLog.rowIndex = "1";
      scanRecordLog.orderDetailId = udiList[i].orderDetailId;
      scanRecordLog.material = udiList[i].material;
      scanRecordLog.batchNo = udiList[i].batchNo;
      scanRecordLog.produceDate = udiList[i].produceDate;
      scanRecordLog.validateDate = udiList[i].validateDate;
      scanRecordLog.serialNumber = udiList[i].serialNumber;
      scanRecordLogList.push(scanRecordLog);
    }
    //新增扫码日志
    let scanlog = { billCode: billCode, billType: billName };
    scanlog.UDIScanRecordEntryList = scanRecordLogList;
    ObjectStore.insert("I0P_UDI.I0P_UDI.UDIScanRecordv3", scanlog, "1fee2040List");
    if (udiNeedReleases.length > 0) {
      //添加生成工作台记录
      let udi_create_platform = { test: "新增" };
      udi_create_platform.udi_release_data_infov3List = udiNeedReleases;
      ObjectStore.insert("I0P_UDI.I0P_UDI.udi_create_platformv3", udi_create_platform, "99f8f957");
    }
    return { result: "单号:" + successCode.substr(0, successCode.length - 1), msg: message };
  }
}
exports({ entryPoint: MyAPIHandler });