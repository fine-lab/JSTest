let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var requestData = request.data;
    //会员手机号
    let queryMembertxt = requestData.membertxt;
    //预订单编码
    let codeValue = requestData.code;
    //是否线下数据
    let isofflineValue = requestData.isoffline;
    if (queryMembertxt == null && codeValue == null && isofflineValue == null) {
      throw new Error("查询失败，请输入查询条件");
    }
    let whereValue = " and 1=1 ";
    if ("true" == isofflineValue) {
      //查询非小程序数据
      whereValue = whereValue + " and agentId not in ('2772671869687808') ";
    }
    if (queryMembertxt != null) {
      whereValue = whereValue + " and membertxt='" + queryMembertxt + "' ";
    }
    if (codeValue != null) {
      whereValue = whereValue + " and code='" + codeValue + "'";
    }
    //开始页签
    var pageIndexValue = Number(requestData.pageIndex);
    //每页查询条数
    var pageSizeValue = Number(requestData.pageSize);
    if (pageIndexValue <= 0) {
      pageIndexValue = 1;
    }
    if (pageSizeValue <= 0) {
      pageSizeValue = 10;
    }
    if (pageSizeValue > 50) {
      pageSizeValue = 50;
    }
    let returnData = {};
    returnData.pageIndex = pageIndexValue;
    returnData.pageSize = pageSizeValue;
    returnData.beginPageIndex = 1;
    let queryCountSql = "select count(id)  from  GT80266AT1.GT80266AT1.salesAdvanceOrder where dr=0 " + whereValue;
    var countList = ObjectStore.queryByYonQL(queryCountSql);
    let recordCountValue = Number(countList[0].id);
    returnData.recordCount = recordCountValue;
    if (recordCountValue > 0) {
      let limitStart = pageSizeValue * (pageIndexValue - 1) + 1;
      let limitEnd = pageSizeValue * pageIndexValue;
      let querySql = "select * from  GT80266AT1.GT80266AT1.salesAdvanceOrder where dr=0 " + whereValue + " limit " + limitStart + "," + limitEnd + "";
      var recordList = ObjectStore.queryByYonQL(querySql);
      if (recordList.length > 0) {
        for (var i = 0; i < recordList.length; i++) {
          let hdata = recordList[i];
          let querybSql = "select * from GT80266AT1.GT80266AT1.salesAdvanceOrder_b where dr=0 and salesAdvanceOrder_id=" + hdata.id;
          let bRes = ObjectStore.queryByYonQL(querybSql);
          if (bRes.length > 0) {
            hdata.salesAdvanceOrder_bList = bRes;
          }
        }
      }
      returnData.recordList = recordList;
      let pageCountValue = Math.ceil(recordCountValue / pageSizeValue);
      returnData.pageCount = pageCountValue;
      returnData.endPageIndex = pageCountValue;
    } else {
      returnData.pageCount = 0;
      returnData.recordList = new Array();
      returnData.endPageIndex = 0;
    }
    return returnData;
  }
}
exports({ entryPoint: MyAPIHandler });