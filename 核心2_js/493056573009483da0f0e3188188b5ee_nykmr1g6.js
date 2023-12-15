let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取销售退回单ID
    var returnId = request.returnId;
    // 获取
    let sqlstr0 = "select verifystate from   GT22176AT10.GT22176AT10.sy01_gspsalereturn where id =" + returnId;
    let returns0 = ObjectStore.queryByYonQL(sqlstr0);
    if (returns0.length < 1) {
      return { errInfo: "单据" + request.returnCode + "未查询到需要生单的单据！" };
    } else if (returns0[0].verifystate != 2) {
      return { errInfo: "单据" + request.returnCode + "未审核，请审核后下推！" };
    }
    // 根据销售退回单ID查询退回单表体
    var sqlstr = "select id , fcheckbqdqty , fcounterrechecksumqty from GT22176AT10.GT22176AT10.sy01_gspsalereturns  where  sy01_gspsalereturn_id = '" + returnId + "'";
    var returns = ObjectStore.queryByYonQL(sqlstr);
    // 判断表体
    var flag = false; // 是否存在可以复查的单据
    //遍历表体
    for (var i = 0; i < returns.length; i++) {
      var sqlstr = "select sum(newReviewQty) as sumqty  from GT22176AT10.GT22176AT10.SY01_quareventryv1  where  sourcechild_id = '" + returns[i].id + "'";
      var checks = ObjectStore.queryByYonQL(sqlstr);
      // 获取退回单的数量
      var allqty = returns[i].fcheckbqdqty;
      var sumqty = 0;
      if (checks.length > 0) {
        sumqty = checks[0].sumqty;
      }
      // 判断是不是已经全部复查
      if (allqty > sumqty) {
        flag = true;
      }
    }
    if (!flag) {
      return { errInfo: "单据" + request.returnCode + "不存在需要复查的商品！" };
    }
    var auditmsg = "";
    var auditflag = false; // 是否存在可以复查的单据
    var returncheckuri = "GT22176AT10.GT22176AT10.Sy01_quareview";
    var param = { id: returnId, uri: returncheckuri };
    let checkAuditFun = extrequire("GT22176AT10.publicFunction.checkChildOrderAudit");
    let res = checkAuditFun.execute(param);
    if (res.Info && res.Info.length > 0) {
      return { errInfo: res.Info };
    }
    // 下游单据未全部审核
    // 返回校验结果
    return { data: flag };
  }
}
exports({ entryPoint: MyAPIHandler });