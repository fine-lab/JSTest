let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let ids = param.ids;
    let updateDatas = [];
    let sendData = [];
    let notSendCodes = [];
    let notSendIds = new Map();
    let sendMap = new Map();
    let updateMap = new Map();
    let cabinetMap = new Map();
    let reg = /第 \d+[,0-9]* 行明细未找到物料信息！\n*/g;
    let sql = "select id,code,vendorId,vendor,creation_date,errorMessage,dataStatus,dd.item_type item_type,dd.batchNumber batchNumber,dd.deviceSupplier deviceSupplier,dd.productType productType,";
    sql += "dd.atpOrder atpOrder,dd.itemCategory itemCategory,dd.orderPriority orderPriority,dd.orderMode orderMode,dd.equipmentRoom equipmentRoom,";
    sql += "dd.shipToLocation shipToLocation,dd.shipToContact shipToContact,dd.shipToContactPhone shipToContactPhone,dd.country country,dd.province province,";
    sql += "dd.city city,dd.poStatus poStatus,dd.cpd cpd,dd.esd esd,dd.eta eta,dd.poLineId poLineId,dd.productCode productCode,dd.customLogo customLogo,";
    sql +=
      "dd.orderedQuantity orderedQuantity,dd.rsd rsd,dd.rsd2 rsd2,dd.dcNameCn dcNameCn,dd.itemCode itemCode,dd.oriRequestedQuantity oriRequestedQuantity,dd.shippingMethod shippingMethod,dd.cabinetNodeCode cabinetNodeCode,dd.quantitiy quantitiy ";
    sql += " from GT37595AT2.GT37595AT2.shippingschedule ";
    sql += " inner join GT37595AT2.GT37595AT2.shippingscheduleb dd on dd.shippingschedule_id = id ";
    sql += " where id in ('" + ids.join("','") + "') and dd.dr = '0'";
    let res = ObjectStore.queryByYonQL(sql);
    let sconfigFunc = extrequire("GT37595AT2.commonFun.sConfigFunc");
    let sconfig = sconfigFunc.execute();
    //多供应商场景下的供应商信息获取
    let verdorFunction = extrequire("GT37595AT2.commonFun.checkVendorPush");
    let vendorInfoRet = verdorFunction.execute(context, param);
    //获取odmCode对应的供应商信息 'HT'-> vendorObj
    let odmCodeToVendor = vendorInfoRet.odmCodeToVendor;
    let vendorIdToVendor = vendorInfoRet.vendorIdToVendor;
    for (let i = 0; i < res.length; i++) {
      let item = res[i];
      let itemSql = "";
      if (item.cabinetNodeCode) {
        itemSql =
          "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and detail.shortName = '" +
          item.cabinetNodeCode +
          "'";
      } else {
        itemSql =
          "select manageClass.code,manageClass.name,detail.shortName,detail.purchasePriceUnit.code,detail.purchaseUnit.code,unit.code,* from pc.product.Product where detail.stopstatus = 'false' and model = '" +
          item.itemCode +
          "'";
      }
      let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
      // 物料信息不存在，不发送
      if (!itemRes || itemRes.length == 0 || !itemRes[0].code) {
        if (item.cabinetNodeCode) {
          // 风冷整机查询不到对应物料，直接抛异常
          throw new Error("要货单号：" + item.code + "，整柜节点编码：" + item.cabinetNodeCode + " 查询不到物料信息，请检查！");
        }
        notSendCodes.push(item.code);
        notSendIds.set(item.id, 1);
        if (sendMap.has(item.id)) {
          // 整批不发送
          sendMap.delete(item.id);
          updateMap.delete(item.id);
        }
        continue;
      }
      if (item.orderMode == "6035") {
        // 算力模式为6035不发送供应商
        throw new Error("要货单号：" + item.code + "，算力模式为6035，不允许推送供应商，请检查！");
      }
      if (!vendorIdToVendor[item.vendorId].extendPushDown) {
        throw new Error("要货单号：" + item.code + "，算力模式为6035，不允许推送供应商，请检查！");
      }
      // 其中一条物料编码找不到，整个批次不推送供应商
      if (notSendIds.has(item.id)) {
        continue;
      }
      let htData = {};
      htData.GROUP_ID = item.id;
      htData.MODEL_NUMBER = "";
      htData.ORIG_ITEM_NUMBER = itemRes[0].code;
      if (!item.oriRequestedQuantity) {
        item.oriRequestedQuantity = 0;
      } else {
        item.oriRequestedQuantity = Number(item.oriRequestedQuantity);
      }
      htData.QTY = item.oriRequestedQuantity;
      if (item.cabinetNodeCode) {
        htData.MODEL_NUMBER = itemRes[0].code;
        htData.ORIG_ITEM_NUMBER = "";
        htData.QTY = item.quantitiy;
      }
      htData.DEMAND_ORDER = item.item_type;
      htData.BATCH_NUMBER = item.batchNumber;
      htData.SL_VENDOR = item.deviceSupplier;
      htData.PRODUCT_TYPE = item.productType;
      htData.ATP_ORDER = item.atpOrder;
      htData.CATEGORY = item.itemCategory;
      htData.DATA_CENTRE = item.dcNameCn;
      htData.ORIGINAL_RSD = item.rsd;
      if (item.rsd2) {
        htData.LATEST_RSD = item.rsd2;
      } else {
        htData.LATEST_RSD = item.rsd;
      }
      htData.ORDER_PRIORITY = item.orderPriority;
      htData.PROCUREMENT_MODEL = item.orderMode;
      htData.ROOM_ID = item.equipmentRoom;
      htData.SHIP_TO_ADDRESS = item.shipToLocation;
      htData.SHIP_TO_CONTACT = item.shipToContact;
      htData.SHIP_TO_CONTACT_TEL = item.shipToContactPhone;
      if (!item.country) {
        htData.SHIP_TO_CONTRY = "China";
      } else {
        htData.SHIP_TO_CONTRY = item.country;
      }
      htData.SHIP_TO_PROVINCE = item.province;
      htData.SHIP_TO_CITY = item.city;
      htData.CUSTOMGER_PO_NO = ""; // 暂时为空
      htData.CUSTOMER_PO_STATUS = item.poStatus;
      // 算力供应商非SS的，客户编码、客户名称都不传值，传空
      if (item.deviceSupplier == sconfig.BASE.deviceSupplier) {
        htData.CUSTOMER_CODE = sconfig.BASE.CUSTOMER_CODE;
        htData.CUSTOMER_NAME = sconfig.BASE.CUSTOMER_NAME;
      } else {
        htData.CUSTOMER_CODE = "";
        htData.CUSTOMER_NAME = "";
      }
      htData.SHIPPING_METHOD = item.shippingMethod;
      htData.FOB = "";
      htData.FOB_ADDRESS = "";
      htData.PO_CONFIRM_DATE = null; // 供应商反推
      htData.PO_ACTIVE_DATE = null; // 供应商反推
      htData.ORIG_CPD = item.cpd;
      htData.ORIG_ESD = item.esd;
      htData.ORIG_ETA = item.eta;
      htData.RECEIVE_DEMAND_DATE = item.creation_date;
      htData.RECEIVE_CEG_PRICE_DATE = null; // 暂时为空
      htData.CURRENCY = "CNY";
      htData.DEMAND_LINE_ID = item.poLineId;
      htData.PRODUCT_NAME = item.productCode;
      htData.CUSTOMIZATION_FLAG = item.customLogo;
      htData.MATCH_QTY = item.orderedQuantity;
      htData.DESCRIPTION = item.itemRemark;
      htData.UNIT_PRICE = ""; // 暂时为空
      htData.ATTRIBUTE1 = "";
      htData.ATTRIBUTE2 = "";
      htData.ATTRIBUTE3 = "";
      htData.ATTRIBUTE4 = "";
      htData.ATTRIBUTE5 = "";
      let errorMessage = "";
      let dataStatus = "";
      if (item.errorMessage) {
        errorMessage = item.errorMessage
          .replace(/推送供应商失败！\n*/g, "")
          .replace(/推送供应商失败！\n*/g, "")
          .replace(reg, "");
        if (errorMessage.indexOf("未找到物料信息，请检查！") != -1) {
          errorMessage = errorMessage.replace(/未找到物料信息，请检查！\n*/g, "");
        }
      }
      if (!item.dataStatus || item.dataStatus == "1") {
        // 状态：新建
        dataStatus = "2";
        htData.ACTION_TYPE = "INSERT";
      } else {
        dataStatus = item.dataStatus;
        htData.ACTION_TYPE = "UPDATE";
      }
      if (
        (item.cabinetNodeCode && !cabinetMap.has(item.id + "_" + item.cabinetNodeCode)) || // 风冷整机
        !item.cabinetNodeCode
      ) {
        // 非冷风整柜，照旧
        if (sendMap.has(item.id)) {
          let sendArr = sendMap.get(item.id);
          sendArr.push(htData);
          sendMap.set(item.id, sendArr);
        } else {
          sendMap.set(item.id, [htData]);
        }
        updateMap.set(item.id, { id: item.id, errorMessage: errorMessage, dataStatus: dataStatus });
        cabinetMap.set(item.id + "_" + item.cabinetNodeCode, 1);
      }
    }
    sendMap.forEach((value, key) => {
      value.forEach((itemData) => {
        sendData.push(itemData);
      });
      updateDatas.push(updateMap.get(key));
    });
    if (sendData.length == 0) {
      return { status: "2", notSendCodes: notSendCodes };
    }
    let configFunc = extrequire("AT173E4CEE16E80007.CommonFun.sConfigFunc");
    let config = configFunc.execute();
    let htUrl = config.BASE.HT_URL + config.BASE.HT_URL_SHI;
    let htBody = { Source_Channel: config.BASE.HT_SOURCE_CHANNEL, DATA: sendData };
    let htHeader = {};
    if (config.BASE.SEND_CODE == "HT") {
      let times = getTime();
      let secret = SHA256Encode(times + config.BASE.HT_TOKEN);
      htHeader = { "Content-Type": "application/json", timestamp: times, ciphertext: secret };
    } else {
      let encodeStr = config.AUTH_INFO.USER + ":" + config.AUTH_INFO.KEY;
      let authorization = "Basic " + Base64Encode(encodeStr);
      htHeader = { "Content-Type": "application/json", Authorization: authorization };
    }
    let exeHtRequestDate = getDate();
    let htResponse = postman("post", htUrl, JSON.stringify(htHeader), JSON.stringify(htBody));
    let htResponseObj = JSON.parse(htResponse);
    let exeHtResponseDate = getDate();
    // 记录日志
    try {
      let logHtObj = {
        _status: "Insert",
        methodName: config.BASE.HT_URL_SHI,
        requestParams: JSON.stringify(htBody),
        requestTime: exeHtResponseDate,
        respResult: htResponse,
        respTime: exeHtResponseDate,
        url: htUrl
      };
      var resHtLog = ObjectStore.insert("AT173E4CEE16E80007.AT173E4CEE16E80007.logRecord", logHtObj, "yb6b993e05");
    } catch (e) {}
    if (htResponseObj.status && htResponseObj.status == "success") {
      // 推送供应商成功，回写要货计划数据状态，清除对应异常信息
      ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateDatas, "02a3de71");
    } else {
      return { status: "2", message: "推送供应商失败！" };
    }
    if (notSendCodes.length == 0) {
      return { status: "0" };
    } else {
      return { status: "1", notSendCodes: notSendCodes };
    }
    function getTime() {
      var timezone = 8; //目标时区时间，东八区
      var offset_GMT = new Date().getTimezoneOffset(); //本地时间和格林威治的时间差，单位为分钟
      var nowDate = new Date().getTime(); //本地时间距 1970 年 1 月 1 日午夜(GMT 时间)之间的毫秒数
      var date = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      return date.getTime();
    }
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
exports({ entryPoint: MyTrigger });