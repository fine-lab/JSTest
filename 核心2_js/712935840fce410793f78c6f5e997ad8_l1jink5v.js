let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //采购到货单
    var fhdurl = "https://www.example.com/" + request.access_token;
    var strResponse = postman("post", fhdurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //添加的方式
      var recordList = [];
      var colArry =
        "vouchdate,arrivalOrders_subQty,priceUOM,code,busType,vendor,vendor_name,arrivalOrders_id,id,invoiceSupplier,currency,auditTime,natCurrency,product," +
        "product,product_cCode,propertiesValue,unit,qty,arrivalOrders_purUOM,taxRate,arrivalOrders_invExchRate,arrivalOrders_isExpiryDateManage," +
        "arrivalOrders_isBatchManage,arrivalOrders_upcode,sourceid,arrivalOrders_sourceautoid,batchno,arrivalOrders_batchno,define1," +
        "arrivalOrders_producedate,define2,define3,arrivalOrders_warehouse,arrivalOrders_invaliddate,memo";
      var idArray = "vendor,arrivalOrders_id,invoiceSupplier,product,unit,arrivalOrders_purUOM,sourceid,arrivalOrders_sourceautoid,bodyItem_id,id,";
      var colName = colArry.split(",");
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var oldRec = responseObj.data.recordList[i];
        var newRec = {};
        for (var j = 0; j < colName.length; j++) {
          var returnColName = colName[j];
          if (idArray.indexOf(returnColName + ",") >= 0) {
            newRec[returnColName] = oldRec[returnColName] + "";
          } else {
            newRec[returnColName] = oldRec[returnColName];
          }
        }
        //处理表头自定义项
        for (var prop in oldRec.headItem) {
          var key = prop;
          var val = oldRec.headItem[prop];
          newRec["headItem_" + key] = val;
        }
        //处理表体自定义项
        for (var bodyProp in oldRec.bodyItem) {
          var bodyKey = bodyProp;
          var bodyVal = oldRec.bodyItem[bodyProp];
          newRec["bodyItem_" + bodyKey] = bodyVal;
        }
        //特殊处理
        newRec["arrivalOrders_batchno"] = oldRec["arrivalOrders_batchno"] === undefined ? "" : oldRec["arrivalOrders_batchno"] + "";
        newRec["define1"] = oldRec["define1"] === undefined ? "" : oldRec["define1"] + "";
        newRec["define2"] = oldRec["define2"] === undefined ? "" : oldRec["define2"] + "";
        newRec["define3"] = oldRec["define3"] === undefined ? "" : oldRec["define3"] + "";
        newRec["memo"] = oldRec["memo"] === undefined ? "" : oldRec["memo"] + "";
        newRec["arrivalOrders_producedate"] = oldRec["arrivalOrders_producedate"] === undefined ? "" : oldRec["arrivalOrders_producedate"] + "";
        newRec["arrivalOrders_warehouse"] = oldRec["arrivalOrders_warehouse"] === undefined ? "" : oldRec["arrivalOrders_warehouse"] + "";
        //供应商编码--UI模板
        newRec["cvencode"] = oldRec["pu_arrivalorderlist_userDefine001"] === undefined ? "" : oldRec["pu_arrivalorderlist_userDefine001"] + "";
        newRec.headItem = oldRec.headItem;
        newRec.bodyItem = oldRec.bodyItem;
        recordList.push(newRec);
      }
      return {
        pageIndex: responseObj.data.pageIndex + "",
        pageSize: responseObj.data.pageSize + "",
        pageCount: responseObj.data.pageCount + "",
        beginPageIndex: responseObj.data.beginPageIndex + "",
        endPageIndex: responseObj.data.endPageIndex + "",
        pubts: responseObj.data.pubts,
        recordCount: responseObj.data.recordCount + "",
        recordList: recordList,
        message: recordList.length === 0 ? "当前条件下没有数据" : responseObj.message
      };
    } else {
      throw new Error(responseObj.message);
    }
  }
}
exports({ entryPoint: MyAPIHandler });