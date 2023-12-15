let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let uriFunc = extrequire("GT4691AT1.publicfun.getdomainurl");
    let uriRes = uriFunc.execute("", "");
    let gatewayurl = uriRes.domainurl.gatewayUrl;
    //采购到货单
    var fhdurl = gatewayurl + "/yonsuite/scm/storetransfer/list?access_token=" + request.access_token;
    var strResponse = postman("post", fhdurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    var transIdArray = [];
    if ("200" == responseObj.code) {
      //添加的方式
      var recordList = [];
      var colArry =
        "vouchdate,code,outWarehouse,inWarehouse,businesstype,storeTransDetail_product_cCode,storeTransDetail_propertiesValue," +
        "sBatchNo,invaliddate,storeTransDetail_qty,storeTransDetail_product_cName,details_id,details_stockUnitId,auditTime," +
        "subQty,storeTransDetail_unit,storeTransDetail_invExchRate,audittime,sn,producedate,define1,define2,define3";
      var colName = colArry.split(",");
      var currentNodeTemp = {};
      for (var m = responseObj.data.recordList.length - 1; m >= 0; m--) {
        var oldRec = responseObj.data.recordList[m];
        var id = oldRec["id"];
        if (transIdArray.indexOf(id) < 0) {
          var newRec = {};
          for (var j = 0; j < colName.length; j++) {
            var returnColName = colName[j];
            newRec[returnColName] = oldRec[returnColName];
          }
          //批次属性
          newRec["define1"] = oldRec["st_storetransferlist_userDefine001"]; //长批号
          newRec["define2"] = oldRec["st_storetransferlist_userDefine003"]; //失效日期
          newRec.st_storetransferSN = [];
          //获取序列号
          var sn = oldRec["st_storetransferlist_userDefine002"];
          var snObj = {};
          snObj["sn"] = sn;
          snObj["qty"] = 1;
          newRec.st_storetransferSN.push(snObj);
          currentNodeTemp = newRec;
          //插入对象
          recordList.push(newRec);
          //记录当前ID
          transIdArray.push(id);
        } else {
          var sn2 = oldRec["st_storetransferlist_userDefine002"];
          var snObj2 = {};
          snObj2["sn"] = sn2;
          snObj2["qty"] = 1;
          currentNodeTemp.st_storetransferSN.push(snObj2);
        }
      }
      return {
        pageIndex: responseObj.data.pageIndex,
        pageSize: responseObj.data.pageSize,
        pageCount: transIdArray.length,
        beginPageIndex: responseObj.data.beginPageIndex,
        endPageIndex: responseObj.data.endPageIndex,
        pubts: responseObj.data.pubts,
        recordCount: transIdArray.length,
        recordList: recordList,
        message: recordList.length === 0 ? "当前条件下没有数据" : responseObj.message,
        request: request
      };
    } else {
      throw new Error(responseObj.message);
    }
  }
}
exports({ entryPoint: MyAPIHandler });