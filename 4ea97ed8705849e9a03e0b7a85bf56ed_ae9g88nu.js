let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取销售出库单ID
    var id = request.id;
    // 获取当前单据的审核状态，未审核不允许下推 GT22176AT10.GT22176AT10.sy01_saleoutstofhv6
    let sqlstrone = "select verifystate from GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where id=" + id;
    let returnsOne = ObjectStore.queryByYonQL(sqlstrone);
    if (returnsOne.length < 1) {
      return { errInfo: "未查询到需要生单的单据！" };
    } else if (returnsOne[0].verifystate != 2) {
      return { errInfo: "单据未审核，请审核后下推！" };
    }
    return { errInfo: "" };
  }
}
exports({ entryPoint: MyAPIHandler });