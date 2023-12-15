let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request.pageSize === undefined) {
      throw new Error("pageSize必须传入");
    }
    if (request.pageIndex === undefined) {
      throw new Error("pageIndex必须传入");
    }
    if (request.pageSize > 100) {
      request.pageSize = 100;
    }
    //重要：此接口权限需要从应用构建-前置销售订单下，授权销售出库单列表查询接口
    let func = extrequire("GT4691AT1.publicfun.getSystemToken");
    let res = func.execute("", "");
    let authFunc = extrequire("GT4691AT1.zotieszmu8.getZMWHAuth");
    let authResult = authFunc.execute(request);
    request.warehouse_name = authResult;
    let func = extrequire("GT4691AT1.publicfun.getdomainurl");
    let uriRes = func.execute("", "");
    let gatewayurl = uriRes.domainurl.gatewayUrl;
    var saleorderurl = gatewayurl + "/yonbip/scm/stockanalysis/list?access_token=" + res.access_token;
    var strResponse = postman("post", saleorderurl, null, JSON.stringify(request));
    var responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      //添加的方式
      var recordList = [];
      var colArry =
        "warehouse_name#warehouse_name,product_productProps!define2#first_level_category,productClass_name#product_class_name,product_cCode#product_code,product_cName#product_name,batchno#batchno,batchno_define1#long_batchno,producedate#producedate,batchno_define2#invaliddate,unitName#unitName,currentqty#currentqty,stock_stockanalysis_userDefine003#available_qty,innoticeqty#innoticeqty,outnoticeqty#outnoticeqty,preretailqty#outqty,stock_stockanalysis_userDefine002#inqty,warehouse#warehouseId,product#productId";
      var idArray = "product,warehouse";
      var colName = colArry.split(",");
      for (var i = responseObj.data.recordList.length - 1; i >= 0; i--) {
        var oldRec = responseObj.data.recordList[i];
        var newRec = {};
        for (var j = 0; j < colName.length; j++) {
          var colInfo = colName[j].split("#");
          var sourceFieldName = colInfo[0];
          var retureFieldName = colInfo.length == 2 ? colInfo[1] : colInfo[0];
          var returnColName = colName[j];
          if (idArray.indexOf(sourceFieldName + ",") >= 0) {
            newRec[retureFieldName] = oldRec[sourceFieldName] + "";
          } else {
            newRec[retureFieldName] = oldRec[sourceFieldName];
          }
        }
        recordList.push(newRec);
      }
      return {
        pageIndex: responseObj.data.pageIndex + "",
        pageSize: responseObj.data.pageSize + "",
        pageCount: responseObj.data.pageCount + "",
        beginPageIndex: responseObj.data.beginPageIndex + "",
        endPageIndex: responseObj.data.endPageIndex + "",
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