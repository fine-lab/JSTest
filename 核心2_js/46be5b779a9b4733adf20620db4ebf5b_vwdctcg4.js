let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //销售发货单
    let func = extrequire("GT4691AT1.publicfun.getSystemToken");
    let res = func.execute(null, null);
    let func = extrequire("GT4691AT1.publicfun.getdomainurl");
    let uriRes = func.execute("", "");
    let gatewayurl = uriRes.domainurl.gatewayUrl;
    var fhdurl = gatewayurl + "/yonsuite/sd/voucherdelivery/list?access_token=" + res.access_token;
    //过滤科园
    var requestSimpleVOs = request.simpleVOs;
    var simpleVOs = [];
    if (requestSimpleVOs != null) {
      for (var i = requestSimpleVOs.length - 1; i >= 0; i--) {
        if (requestSimpleVOs[i].field == "headItem.define2" && requestSimpleVOs[i].value1 == "科园") {
          continue;
        }
        simpleVOs.push(requestSimpleVOs[i]);
      }
    }
    var define2 = {};
    define2["op"] = "neq";
    define2["value1"] = "科园";
    define2["field"] = "headItem.define2";
    simpleVOs.push(define2);
    request.simpleVOs = simpleVOs;
    var strResponse = postman("post", fhdurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //添加的方式
      var recordList = [];
      var colArry =
        "code,orderNoHead,createTime,vouchdate,agentId,agentId_name,deliveryId,orderNo,orderId,orderDetailId,productCode,productName," +
        "subQty,invExchRate,masterUnitId,qty,sendDate,stockId,batchNo,productDate,batchDefine2,isBatchManage,isExpiryDateManage," +
        "productId,productUnitId,taxRate,remark,deliveryDetailId,audittime,receiver,receiveMobile,receiveAddress," +
        "batchDefine3,batchDefine1,transactionTypeId,productAuxUnitId,corpContact,corpContactUserName,deliveryDetails_detailSaleDepartmentId,detailSaleDepartmentName";
      var idArray =
        "agentId,productAuxUnitId,deliveryId,orderId,orderDetailId,masterUnitId,stockId,productUnitId,deliveryDetailId,transactionTypeId,corpContact,deliveryDetails_detailSaleDepartmentId";
      var colName = colArry.split(",");
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var oldRec = responseObj.data.recordList[i];
        var newRec = {};
        for (var j = 0; j < colName.length; j++) {
          var returnColName = colName[j];
          if (idArray.indexOf(returnColName + ",") >= 0) {
            newRec[returnColName] = oldRec[returnColName];
          } else {
            newRec[returnColName] = oldRec[returnColName];
          }
        }
        //处理表头自定义项
        for (var prop in oldRec.headItem) {
          var key = prop;
          var val = oldRec.headItem[prop];
          newRec["headItem_" + key] = val + "";
        }
        //处理表体自定义项
        for (var bodyProp in oldRec.bodyItem) {
          var bodyKey = bodyProp;
          var bodyVal = oldRec.bodyItem[bodyProp];
          newRec["bodyItem_" + bodyKey] = bodyVal + "";
        }
        newRec["ccuscode"] = oldRec["voucher_deliverylist_userDefine001"] === undefined ? "" : oldRec["voucher_deliverylist_userDefine001"];
        //处理发货信息
        var preOrder = newRec["headItem_define1"] === undefined ? "" : newRec["headItem_define1"];
        var bPreOrder = preOrder != "";
        if (bPreOrder) {
          newRec["receiver"] = newRec["headItem_define13"] === undefined ? "" : newRec["headItem_define13"];
          newRec["receiveMobile"] = newRec["headItem_define14"] === undefined ? "" : newRec["headItem_define14"];
          newRec["receiveAddress"] = newRec["headItem_define15"] === undefined ? "" : newRec["headItem_define15"];
        }
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