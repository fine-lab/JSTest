let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let uriFunc = extrequire("GT4691AT1.publicfun.getdomainurl");
    let uriRes = uriFunc.execute("", "");
    let gatewayurl = uriRes.domainurl.gatewayUrl;
    //其他出库单
    var fhdurl = gatewayurl + "/yonbip/scm/othoutrecord/list?access_token=" + request.access_token;
    var strResponse = postman("post", fhdurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //添加的方式
      var recordList = [];
      var colArry =
        "createTime,vouchdate,code,warehouse,bustype,bustype_name,othOutRecords_product,othOutRecords_product_cCode,batchno,invaliddate," +
        "othOutRecords_qty,othOutRecords_subQty,othOutRecords_unit,othOutRecords_stockUnitId,othOutRecords_invExchRate,sn," +
        "snQty,producedate,define1,define2,define3,memo";
      var idArray = "bustype,othOutRecords_product,othOutRecords_unit,othOutRecords_stockUnitId,othOutRecords_invExchRate,snQty,";
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
        newRec["memo"] = oldRec["memo"] === undefined ? "" : oldRec["memo"] + "";
        //序列号--UI模板
        newRec["sn"] = oldRec["st_othoutrecordlist_userDefine004"] === undefined ? "" : oldRec["st_othoutrecordlist_userDefine004"] + "";
        //序列号数量--UI模板
        newRec["snQty"] = oldRec["st_othoutrecordlist_userDefine005"] === undefined ? "" : oldRec["st_othoutrecordlist_userDefine005"] + "";
        //序列号--UI模板
        newRec["define1"] = oldRec["st_othoutrecordlist_userDefine002"] === undefined ? "" : oldRec["st_othoutrecordlist_userDefine002"] + "";
        //序列号--UI模板
        newRec["define2"] = oldRec["st_othoutrecordlist_userDefine001"] === undefined ? "" : oldRec["st_othoutrecordlist_userDefine001"] + "";
        //序列号--UI模板
        newRec["define3"] = oldRec["st_othoutrecordlist_userDefine003"] === undefined ? "" : oldRec["st_othoutrecordlist_userDefine003"] + "";
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