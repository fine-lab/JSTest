let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestData = request.data;
    let codeValue = requestData.code;
    let whereValue = " and 1=1 ";
    if (codeValue != null) {
      whereValue = whereValue + " and code ='" + codeValue + "'";
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
    let queryCountSql = "select count(id)  from  GT101792AT1.GT101792AT1.codelibrary where dr=0 " + whereValue;
    var countList = ObjectStore.queryByYonQL(queryCountSql);
    let recordCountValue = Number(countList[0].id);
    returnData.recordCount = recordCountValue;
    if (recordCountValue > 0) {
      let limitStart = pageSizeValue * (pageIndexValue - 1) + 1;
      let limitEnd = pageSizeValue * pageIndexValue;
      let querySql = "select * from  GT101792AT1.GT101792AT1.codelibrary where dr=0 " + whereValue + " limit " + limitStart + "," + limitEnd + "";
      var recordList = ObjectStore.queryByYonQL(querySql);
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