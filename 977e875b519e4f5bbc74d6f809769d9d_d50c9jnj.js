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
    if ("LX" != source) {
      responseObj.code = "999";
      responseObj.message = "参数source错误";
      return responseObj;
    }
    let outSql = "select taskDirectiveStatus,taskDirectiveId, resItemCode,virtualItemCode,needInOutBoundQty,arrivedQty,inTransitQty,";
    outSql += " poOnRoadQty,poNotReleaseQty,stockerCode,taskCreatedDate,directiveId,needInOutBoundDate,syncMessageDate,resPoNumber,resQuantity,";
    outSql += " resPoStatus,resOrderTime,batchNumber,batchQty,esdDate,asdDate,etaDate,ataDate,directiveType,resChannel,stockerPn,resManufacturers,resPartNumber, ";
    outSql += " resDcCode,resCategoryName,resPaymentTerms,resQuotationTime,resPrePayTime,resPrePayQty,deleteFlag, ";
    outSql += " createdBy,creationDate,lastUpdatedBy,lastUpdateDate,taskId,resPoId,inboundId,zrCreateTime ";
    outSql += " from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn ";
    outSql += " where stockerCode = '" + source + "' ";
    if (zrCreateTimeStart && zrCreateTimeEnd) {
      outSql += " and zrCreateTime > '" + zrCreateTimeStart + "' ";
      outSql += " and zrCreateTime <= '" + zrCreateTimeEnd + "' ";
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
    //获取物料的id
    let materialId = [];
    outRes.forEach((item) => {
      if (item.resItemCode && item.resItemCode != null) {
        materialId.push(item.resItemCode);
      }
    });
    let materialMap = {};
    if (materialId.length > 0) {
      let itemSql = "select id,code,name,detail.shortName shortName,model,modelDescription from pc.product.Product where detail.stopstatus = 'false' and id in ('" + materialId.join("','") + "')";
      let itemRes = ObjectStore.queryByYonQL(itemSql, "productcenter");
      if (itemRes.length > 0) {
        itemRes.forEach((item) => {
          materialMap[item.id] = item.code;
        });
      }
      outRes.forEach((item) => {
        if (item.resItemCode && item.resItemCode != null) {
          item.resItemCode = materialMap[item.resItemCode];
        }
      });
    }
    if (curPage && curPage > 0 && pageSize && pageSize > 0) {
      // 查询分页
      endIndex = startIndex + outRes.length;
      startIndex += 1;
      let countSql = "select count(1) countNum from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn";
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