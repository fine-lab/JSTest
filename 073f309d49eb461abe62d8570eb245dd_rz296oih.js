let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let source = request.source;
    let zrCreateTimeStart = request.zrCreateTimeStart;
    let zrCreateTimeEnd = request.zrCreateTimeEnd;
    let curPage = request.curPage; // 从第几页查询
    let pageSize = request.pageSize; // 每页多少条
    let responseObj = { pagedResult: { pageVO: {}, result: [] } };
    if (!source) {
      responseObj.code = "999";
      responseObj.message = "入参source必填！请检查！";
      return responseObj;
    }
    let outSql = "select taskDirectiveId,destination,directiveType,itemCode.code as resItemCode,stockerCode,taskCreatedDate,";
    outSql +=
      " directiveId,batchNumber,needInOutBoundQty,taskDirectiveStatus, outboundQty,outboundTime,outboundBeforeQty,issuedQty,outboundRemainingQty,unissuedQty,sCreatedBy createdBy,sCreationDate creationDate,";
    outSql += " sLastUpdatedBy lastUpdatedBy,sLastUpdateDate lastUpdateDate,createTime zrCreateTime,orderNumber,syncMessageDate ";
    outSql += " from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut ";
    outSql += " where stockerCode = '" + source + "' ";
    if (zrCreateTimeStart && zrCreateTimeEnd) {
      outSql += " and createTime > '" + zrCreateTimeStart + "' ";
      outSql += " and createTime <= '" + zrCreateTimeEnd + "' ";
    }
    let startIndex = 0;
    let endIndex = 0;
    if (curPage && curPage > 0 && pageSize && pageSize > 0) {
      // 查询分页
      startIndex = (curPage - 1) * pageSize;
      outSql += " limit " + startIndex + "," + pageSize;
    }
    let outRes = ObjectStore.queryByYonQL(outSql);
    if (!outRes || outRes.length == 0) {
      if (curPage && curPage > 0 && pageSize && pageSize > 0) {
        responseObj.pagedResult.pageVO = { totalRows: 0, curPage: 0, pageSize: pageSize, startIndex: 0, endIndex: 0, totalPages: 0 };
      }
      return responseObj;
    }
    if (curPage && curPage > 0 && pageSize && pageSize > 0) {
      // 查询分页
      endIndex = startIndex + outRes.length;
      startIndex += 1;
      let countSql = "select count(1) countNum from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut";
      countSql += " where stockerCode = '" + source + "' ";
      if (zrCreateTimeStart && zrCreateTimeEnd) {
        countSql += " and createTime >= '" + zrCreateTimeStart + "' ";
        countSql += " and createTime <= '" + zrCreateTimeEnd + "' ";
      }
      let countRes = ObjectStore.queryByYonQL(countSql);
      let countNum = countRes[0].countNum;
      let totalPages = Math.ceil(countNum / pageSize);
      responseObj.pagedResult.pageVO = { totalRows: countNum, curPage: curPage, pageSize: pageSize, startIndex: startIndex, endIndex: endIndex, totalPages: totalPages };
    }
    responseObj.pagedResult.result = outRes;
    return responseObj;
  }
}
exports({ entryPoint: MyAPIHandler });