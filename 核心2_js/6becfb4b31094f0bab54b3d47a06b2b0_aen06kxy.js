let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let pageIndex = request.pageIndex; //页码
    let pageSize = request.pageSize; //每页数量
    let pageCount = 0; //分页总数
    let sql = "select *,warehouse.name from stock.currentstock.CurrentStock order by pubts asc limit " + pageIndex + "," + pageSize;
    var data = ObjectStore.queryByYonQL(sql, "ustock");
    if (pageIndex === "1") {
      let countNumSql = "select count(id) cnt from stock.currentstock.CurrentStock limit " + pageIndex + "," + pageSize;
      var countNum = ObjectStore.queryByYonQL(countNumSql, "ustock");
      pageCount = countNum[0].cnt <= pageSize ? 1 : Math.ceil(countNum[0].cnt / pageSize);
    }
    let res = {
      data: data,
      pageSize: pageSize,
      pageIndex: pageIndex,
      pageCount: pageCount,
      currentPageSize: data.length
    };
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });