let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let reg = /\.\d+\+\d+/g;
    let itemCodes = [];
    data.forEach((item) => {
      if (item.resItemCode) {
        itemCodes.push(item.resItemCode);
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
      // 指令类型为IN的，不要
      if (data[i].directiveType != "OUT") {
        continue;
      }
      // 出入库指令ID+出库指令ID唯一，存在则忽略
      if (exitMap.has(data[i].taskDirectiveId + "_" + data[i].directiveId)) {
        continue;
      }
      exitMap.set(data[i].taskDirectiveId + "_" + data[i].directiveId, 1);
      let exitSql =
        "select count(1) countNum from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut where taskDirectiveId = '" + data[i].taskDirectiveId + "' and directiveId = '" + data[i].directiveId + "'";
      let exitRes = ObjectStore.queryByYonQL(exitSql);
      if (exitRes && exitRes[0].countNum > 0) {
        // 已存在，不处理
        continue;
      }
      let itemData = {};
      itemData.taskDirectiveId = data[i].taskDirectiveId;
      itemData.destination = data[i].destination;
      itemData.directiveType = data[i].directiveType;
      itemData.resItemCode = data[i].resItemCode;
      itemData.stockerCode = data[i].stockerCode;
      itemData.taskCreatedDate = data[i].taskCreatedDate;
      itemData.directiveId = data[i].directiveId;
      itemData.batchNumber = data[i].batchNumber;
      itemData.outboundQty = 0;
      itemData.orderCount = 0;
      itemData.itemCount = data[i].needInOutBoundQty;
      itemData.leftOutCount = data[i].needInOutBoundQty;
      itemData.orderNumber = data[i].orderNumber;
      itemData.needInOutBoundQty = data[i].needInOutBoundQty;
      itemData.taskDirectiveStatus = data[i].taskDirectiveStatus;
      itemData.outboundBeforeQty = data[i].outboundBeforeQty;
      itemData.issuedQty = data[i].issuedQty;
      itemData.outboundRemainingQty = data[i].outboundRemainingQty;
      itemData.unissuedQty = data[i].unissuedQty;
      itemData.orderNumber = data[i].orderNumber;
      itemData.syncMessageDate = data[i].syncMessageDate;
      if (data[i].outboundTime) {
        itemData.outboundTime = data[i].outboundTime.replace(/\//g, "-");
      }
      itemData.sCreatedBy = data[i].createdBy;
      itemData.sLastUpdatedBy = data[i].lastUpdatedBy;
      if (data[i].creationDate) {
        itemData.sCreationDate = data[i].creationDate.replace(/\//g, "-");
      }
      if (data[i].creationDate) {
        itemData.sCreationDate = data[i].creationDate.replace("T", " ").replace(reg, "");
      }
      if (data[i].lastUpdateDate) {
        itemData.sLastUpdateDate = data[i].lastUpdateDate.replace("T", " ").replace(reg, "");
      }
      if (!productMsg[data[i].resItemCode]) {
        itemData.errorMsg = "未找到物料信息，请检查！";
      } else {
        itemData.itemCode = productMsg[data[i].resItemCode].id;
        itemData.itemDesc = productMsg[data[i].resItemCode].modelDescription;
        itemData.itemName = productMsg[data[i].resItemCode].name;
      }
      insertData.push(itemData);
    }
    if (insertData.length == 0) {
      // 没有插入的数据
      return {};
    }
    let insertRes = ObjectStore.insertBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirOut", insertData, "yb97e9b3a5");
    return { insertRes: insertRes };
  }
}
exports({ entryPoint: MyTrigger });