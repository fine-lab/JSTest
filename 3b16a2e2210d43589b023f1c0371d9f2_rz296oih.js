let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.data;
    let responseObj = { code: "200", message: "更新成功！" };
    if (!data || data.length == 0) {
      responseObj.code = "999";
      responseObj.message = "入参data为空！请检查！";
      return responseObj;
    }
    if (data.length > 100) {
      responseObj.code = "999";
      responseObj.message = "入参data长度超过100！请分多次更新！";
      return responseObj;
    }
    let taskDirectiveIds = [];
    let checkWord = [];
    //校验必填字段
    data.forEach((item) => {
      if (!item.taskDirectiveId && !checkWord.includes("taskDirectiveId")) {
        checkWord.push("taskDirectiveId");
      }
      if (!item.directiveType && !checkWord.includes("directiveType")) {
        checkWord.push("directiveType");
      }
      if (!item.resPoNumber && !checkWord.includes("resPoNumber")) {
        checkWord.push("resPoNumber");
      }
      if (!item.resQuantity && !checkWord.includes("resQuantity")) {
        checkWord.push("resQuantity");
      }
      if (!item.resOrderTime && !checkWord.includes("resOrderTime")) {
        checkWord.push("resOrderTime");
      }
      if (!item.batchNumber && !checkWord.includes("batchNumber")) {
        checkWord.push("batchNumber");
      }
      if (!item.esdDate && !checkWord.includes("esdDate")) {
        checkWord.push("esdDate");
      }
      if (!item.etaDate && !checkWord.includes("etaDate")) {
        checkWord.push("etaDate");
      }
      if (item.taskDirectiveId) {
        taskDirectiveIds.push(item.taskDirectiveId);
      }
    });
    if (checkWord.length > 0) {
      responseObj.code = "9992";
      responseObj.message = checkWord + "必填！请检查！";
      return responseObj;
    }
    let outSql = "select id,taskDirectiveId,resItemCode ,needInOutBoundQty ,orderedQuantity,remainingQuantity,directiveType,directiveId from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn ";
    outSql += " where taskDirectiveId in ('" + taskDirectiveIds.join("','") + "')";
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      return responseObj;
    }
    //查询物料
    //重新赋值
    let updateObjs = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < outRes.length; j++) {
        if (outRes[j].taskDirectiveId == data[i].taskDirectiveId) {
          let updateObj = {};
          let detail = {};
          let detailArray = [];
          //明细行数据  start
          detail.dataStatus = "2";
          detail._status = "Insert";
          detail.taskDirectiveId = data[i].taskDirectiveId;
          if (!detail.resItemCode) {
            detail.resItemCode = data[i].resItemCode;
          }
          if (data[i].directiveType == outRes[j].directiveType) {
            detail.directiveType = data[i].directiveType;
          } else {
            responseObj.code = "999";
            responseObj.message = "入参directiveType = " + data[i].directiveType + "不存在";
            return responseObj;
          }
          if (data[i].directiveId == outRes[j].directiveId) {
            detail.directiveId = data[i].directiveId;
          } else {
            responseObj.code = "999";
            responseObj.message = "入参directiveId = " + data[i].directiveId + "不存在";
            return responseObj;
          }
          detail.inBillType = "2";
          detail.resPoNumber = data[i].resPoNumber;
          detail.resQuantity = data[i].resQuantity;
          detail.resOrderTime = data[i].resOrderTime;
          detail.batchNumber = data[i].batchNumber;
          detail.batchQty = data[i].batchQty;
          detail.esdDate = data[i].esdDate;
          detail.etaDate = data[i].etaDate;
          detail.ataDate = data[i].ataDate;
          detail.asdDate = data[i].asdDate;
          detail.resChannel = data[i].resChannel;
          detail.stockerPn = data[i].stockerPn;
          detail.resPrePayTime = data[i].resPrePayTime;
          detail.resQuotationTime = data[i].resQuotationTime;
          detail.resPrePayQty = data[i].resPrePayQty;
          detail.resUsdPrice = data[i].resUsdPrice;
          detail.resRate = data[i].resRate;
          detail.resCnyPrice = data[i].resCnyPrice;
          detail.resDcCode = data[i].resDcCode;
          detail.resCategoryName = data[i].resCategoryName;
          detail.resPartNumber = data[i].resPartNumber;
          detail.resManufacturers = data[i].resManufacturers;
          detail.resPaymentTerms = data[i].resPaymentTerms;
          //余量 = 编码数量 - 下单数量
          detailArray.push(detail);
          //明细行数据  end
          updateObj.id = outRes[j].id;
          data[i].id = outRes[j].id;
          updateObj.ReservoirInDetailList = detailArray;
          updateObjs.push(updateObj);
          break;
        }
      }
      if (!data[i].id) {
        responseObj.code = "999";
        responseObj.message = "入参taskDirectiveId= " + data[i].taskDirectiveId + "，resItemCode =" + data[i].resItemCode + "的记录 不存在！请检查！";
        return responseObj;
      }
    }
    var res = ObjectStore.updateBatch("AT181E613C1770000A.AT181E613C1770000A.ReservoirIn", updateObjs, "yba160dbe1"); //yba160dbe1List
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });