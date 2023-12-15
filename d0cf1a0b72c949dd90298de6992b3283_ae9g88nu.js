let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取销售退回单ID
    var id = request.id;
    var thisCode = request.code;
    var rcheckuri = request.thisuri;
    // 获取当前单据的审核状态，未审核不允许下推
    let sqlstrone = "select verifystate from GT22176AT10.GT22176AT10.sy01_gspsalereturn where id =" + id;
    let returnsOne = ObjectStore.queryByYonQL(sqlstrone);
    if (returnsOne.length < 1) {
      return { errInfo: "单据 " + thisCode + "未查询到需要生单的单据！" };
    } else if (returnsOne[0].verifystate != 2) {
      return { errInfo: "单据 " + thisCode + " 单据未审核，请审核后下推！" };
    }
    var param = { id: id, uri: rcheckuri };
    let checkAuditFun = extrequire("GT22176AT10.publicFunction.checkChildOrderAudit");
    let res = checkAuditFun.execute(param);
    if (res.Info && res.Info.length > 0) {
      return { errInfo: res.Info };
    }
    return { errInfo: "" };
  }
}
exports({ entryPoint: MyAPIHandler });