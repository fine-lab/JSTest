let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let reg = /\.\d+\+\d+/g;
    let itemCodes = [];
    data.forEach((item) => {
      if (item.virtualItemCode) {
        itemCodes.push(item.virtualItemCode);
      }
    });
    let materialFunc = extrequire("AT181E613C1770000A.backFun.changeMaterial");
    let materialRes = materialFunc.execute(null, { itemCodes: itemCodes });
    let productMsg = {};
    if (materialRes && materialRes.productMsg) {
      productMsg = materialRes.productMsg;
    }
    let insertData = [];
    let exitMap = new Map();
    for (let i = 0; i < data.length; i++) {
      // 指令类型为OUT的，不要
      if (data[i].directiveType != "IN") {
        continue;
      }
      // 出入库指令ID+入库指令ID唯一，存在则忽略
      if (exitMap.has(data[i].taskDirectiveId + "_" + data[i].directiveId)) {
        continue;
      }
      exitMap.set(data[i].taskDirectiveId + "_" + data[i].directiveId, 1);
      let exitSql =
        "select count(1) countNum from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn where taskDirectiveId = '" + data[i].taskDirectiveId + "' and directiveId = '" + data[i].directiveId + "'";
      let exitRes = ObjectStore.queryByYonQL(exitSql);
      if (exitRes && exitRes[0].countNum > 0) {
        // 已存在，不处理
        continue;
      }
      //组装入库指令实体
      let itemData = {};
      itemData.taskDirectiveStatus = data[i].taskDirectiveStatus;
      itemData.taskDirectiveId = data[i].taskDirectiveId;
      if (!productMsg[data[i].virtualItemCode]) {
        itemData.errorMsg = "未找到物料信息，请检查！";
      } else {
        itemData.resItemCode = productMsg[data[i].virtualItemCode].id;
        itemData.itemName = productMsg[data[i].virtualItemCode].name;
        itemData.itemDesc = productMsg[data[i].virtualItemCode].modelDescription;
      }
      itemData.virtualItemCode = data[i].virtualItemCode;
      itemData.needInOutBoundQty = data[i].needInOutBoundQty;
      itemData.arrivedQty = data[i].arrivedQty;
      itemData.inTransitQty = data[i].inTransitQty;
      itemData.poOnRoadQty = data[i].poOnRoadQty;
      itemData.poNotReleaseQty = data[i].poNotReleaseQty;
      itemData.stockerCode = data[i].stockerCode;
      if (data[i].taskCreatedDate) {
        itemData.taskCreatedDate = data[i].taskCreatedDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].directiveId) {
        itemData.directiveId = data[i].directiveId.replace("T", " ").replace(reg, "");
      }
      if (data[i].needInOutBoundDate) {
        itemData.needInOutBoundDate = data[i].needInOutBoundDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].syncMessageDate) {
        itemData.syncMessageDate = data[i].syncMessageDate.replace("T", " ").replace(reg, "");
      }
      itemData.resPoNumber = data[i].resPoNumber;
      itemData.resQuantity = data[i].resQuantity;
      itemData.resPoStatus = data[i].resPoStatus;
      if (data[i].resOrderTime) {
        itemData.resOrderTime = data[i].resOrderTime.replace(/\//g, "-");
      }
      itemData.batchNumber = data[i].batchNumber;
      itemData.batchQty = data[i].batchQty;
      if (data[i].esdDate) {
        itemData.esdDate = data[i].esdDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].asdDate) {
        itemData.asdDate = data[i].asdDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].etaDate) {
        itemData.etaDate = data[i].etaDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].ataDate) {
        itemData.ataDate = data[i].ataDate.replace("T", " ").replace(reg, "");
      }
      itemData.directiveType = data[i].directiveType;
      itemData.resChannel = data[i].resChannel;
      itemData.stockerPn = data[i].stockerPn;
      itemData.resManufacturers = data[i].resManufacturers;
      itemData.resPartNumber = data[i].resPartNumber;
      itemData.resDcCode = data[i].resDcCode;
      itemData.resCategoryName = data[i].resCategoryName;
      itemData.resCnyPrice = data[i].resCnyPrice;
      itemData.resRate = data[i].resRate;
      itemData.resUsdPrice = data[i].resUsdPrice;
      itemData.resPaymentTerms = data[i].resPaymentTerms;
      if (data[i].resQuotationTime) {
        itemData.resQuotationTime = data[i].resQuotationTime.replace(/\//g, "-");
      }
      if (data[i].resPrePayTime) {
        itemData.resPrePayTime = data[i].resPrePayTime.replace(/\//g, "-");
      }
      itemData.resPrePayQty = data[i].resPrePayQty;
      itemData.deleteFlag = data[i].deleteFlag;
      itemData.createdBy = data[i].createdBy;
      if (data[i].creationDate) {
        itemData.creationDate = data[i].creationDate.replace(/\//g, "-");
      }
      itemData.lastUpdatedBy = data[i].lastUpdatedBy;
      if (data[i].lastUpdateDate) {
        itemData.lastUpdateDate = data[i].lastUpdateDate.replace(/\//g, "-");
      }
      //初始化余量
      itemData.remainingQuantity = data[i].needInOutBoundQty;
      //初始化已下单数量
      itemData.orderedQuantity = 0;
      itemData.taskId = data[i].taskId;
      itemData.resPoId = data[i].resPoId;
      itemData.inboundId = data[i].inboundId;
      itemData.dataStatus = "1"; // 状态：新建
      itemData.zrCreatedBy = data[i].createdBy;
      itemData.zrCreateTime = getDate();
      itemData.zrLastUpdatedBy = data[i].lastUpdatedBy;
      itemData.zrLastUpdateTime = getDate();
      insertData.push(itemData);
    }
    if (insertData.length == 0) {
      // 没有插入的数据
      return {};
    }
    let insertRes = ObjectStore.insertBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", insertData, "yba160dbe1");
    return { insertRes: insertRes };
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