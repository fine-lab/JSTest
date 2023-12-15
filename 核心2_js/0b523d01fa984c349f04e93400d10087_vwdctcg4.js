let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func = extrequire("GT4691AT1.publicfun.getdomainurl");
    let res = func.execute("", "");
    let gatewayurl = res.domainurl.gatewayUrl;
    var fhdurl = gatewayurl + "/yonsuite/sd/voucherdelivery/list?access_token=" + request.access_token;
    var strResponse = postman("post", fhdurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //删除的方式
      //添加的方式
      var recordList = [];
      var colArry =
        "code,orderNoHead,createTime,vouchdate,agentId,agentId_name,deliveryId,orderNo,orderId,orderDetailId,productCode,productName," +
        "subQty,invExchRate,masterUnitId,qty,sendDate,stockId,batchNo,productDate,batchDefine2,isBatchManage,isExpiryDateManage," +
        "productUnitId,oriTaxUnitPrice,taxRate,remark,deliveryDetailId,audittime,receiver,receiveMobile,receiveAddress,headItem.define1," +
        "headItem!define3,batchDefine3,headItem!define8,batchDefine1,transactionTypeId";
      var colName = colArry.split(",");
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var oldRec = responseObj.data.recordList[i];
        var newRec = {};
        for (var j = 0; j < colName.length; j++) {
          var returnColName = colName[j];
          newRec[returnColName] = oldRec[returnColName];
          newRec.headItem = oldRec.headItem;
          newRec.bodyItem = oldRec.bodyItem;
        }
        recordList.push(newRec);
      }
      return {
        pageIndex: responseObj.data.pageIndex,
        pageSize: responseObj.data.pageSize,
        pageCount: responseObj.data.pageCount,
        beginPageIndex: responseObj.data.beginPageIndex,
        endPageIndex: responseObj.data.endPageIndex,
        pubts: responseObj.data.pubts,
        recordCount: responseObj.data.recordCount,
        recordList: recordList,
        message: recordList.length === 0 ? "当前条件下没有数据" : responseObj.message,
        request: request
      };
    } else {
      return {
        pageIndex: request.pageIndex,
        pageSize: request.pageSize,
        pageCount: 0,
        beginPageIndex: 0,
        endPageIndex: 0,
        recordCount: 0,
        recordList: [],
        code: responseObj.code,
        message: responseObj.message,
        request: request
      };
    }
  }
}
exports({ entryPoint: MyAPIHandler });