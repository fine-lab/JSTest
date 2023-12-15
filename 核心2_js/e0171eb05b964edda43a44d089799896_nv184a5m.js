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
    let udiList = request.udiList; //udi码
    let isSourceOrder = request.isSourceOrder; //是否有源单
    let operation = request.operation; //操作
    let trackingDirection = "来源";
    let billName = "外部来源";
    if (udiList == null || udiList.length == 0) {
      throw new Error("没有可绑定的UDI");
    }
    let orderInfo = request.orderInfo; //订单信息
    let billType = request.billType; //来源单据类型
    if (billType == "yonbip_scm_storeprorecord_list" || billType.indexOf("storeprorecord") > -1) {
      //产品入库单
      billName = "产品入库单";
    } else if (billType == "yonbip_scm_purinrecord_list" || billType.indexOf("purinrecord") > -1) {
      //采购入库
      billName = "采购入库单";
    } else if (billType == "yonbip_scm_othinrecord_list" || billType.indexOf("othinrecord") > -1) {
      //期初库存
      billName = "期初库存单";
    } else if (billType == "yonbip_scm_salesout_list" || billType.indexOf("salesout") > -1) {
      //销售出库单
      billName = "销售出库单";
      trackingDirection = "去向";
    } else if (billType == "yonbip_scm_arrivalorder_list" || billType.indexOf("arrivalorder") > -1) {
      //采购到货
      if (operation == 1) {
        billName = "采购到货单";
      } else {
        billName = "采购到货下推入库";
      }
    } else if (billType == "yonbip_sd_voucherdelivery_list" || billType.indexOf("voucherdelivery") > -1) {
      //销售发货
      if (operation == 1) {
        billName = "销售发货单";
      } else {
        billName = "销售发货下推出库";
      }
      trackingDirection = "去向";
    } else if (billType == "dbdd") {
      //调拨订单下推出库
      if (operation == 1) {
        billName = "调拨订单";
      } else {
        billName = "调拨订单下推出库";
      }
      trackingDirection = "去向";
    } else if (billType == "dcck") {
      //调拨出库下推入库
      if (operation == 1) {
        billName = "调拨出库";
      } else {
        billName = "调拨出库下推入库";
      }
      trackingDirection = "来源";
    }
    let billCode = "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    let isOrderInfo = false;
    if (orderInfo != null && orderInfo != undefined && JSON.stringify(orderInfo) != "{}") {
      billCode = orderInfo.billCode;
      isOrderInfo = true;
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
        if (isSourceOrder == 1) {
          //有源单绑定
          throw new Error(udiList[i].UDI + "在UDI数据中心不存在,无法绑定！");
        } else {
          udiTrack[0].trackingDirection = "生成";
          udiList[i].code = "xxxxxxxxxxxxx4xy".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
              v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          });
          let UDIFile = ObjectStore.insert("I0P_UDI.I0P_UDI.UDIFilev3", udiList[i], "821f4590");
          if (UDIFile == null) {
            throw new Error("绑定UDI失败");
          }
          UDIFile.UDITrackv3List = udiTrack;
          ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", UDIFile, "821f4590");
          if (isOrderInfo) {
            let productConfig = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_configurev3", { bzcpbs: udiList[i].packageIdentification }); //根据包装标识查询商品包装配置
            if (productConfig == null || productConfig.length <= 0) {
              throw new Error("绑定UDI失败，没有配置对应商品包装标识");
            }
            let udi_release_data = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.udi_release_data_infov3", { udiCode: udiList[i].UDI }); //根据UDI查询已发布UDI
            if (udi_release_data == null || udi_release_data.length <= 0) {
              let udiNeedRelease = {};
              (udiNeedRelease._status = "Insert"), (udiNeedRelease.udiCode = udiList[i].UDI);
              udiNeedRelease.udiConfigId = productConfig[0].id;
              udiNeedRelease.sourceType = billType;
              udiNeedRelease.sourceCode = billCode;
              udiNeedRelease.udiState = 2;
              udiNeedReleases.push(udiNeedRelease);
            }
          }
        }
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
    return { result: "success" };
  }
}
exports({ entryPoint: MyAPIHandler });