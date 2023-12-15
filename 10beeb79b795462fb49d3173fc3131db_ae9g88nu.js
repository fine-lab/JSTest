let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取销售出库复核单ID
    var soutId = request.soutId;
    // 获取当前单据的审核状态，未审核不允许下推
    let sqlstr0 = "select verifystate from  GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where id =" + soutId;
    let returns0 = ObjectStore.queryByYonQL(sqlstr0);
    if (returns0.length < 1) {
      return { errInfo: "单据" + request.upBillCode + "未查询到需要生单的单据！" };
    } else if (returns0[0].verifystate != 2) {
      return { errInfo: "单据" + request.upBillCode + "未审核，请审核后下推！" };
    }
    // 根据销售退回单ID查询退回单表体
    var sqlstr = "select id , checkUncertainNum  from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6  where  sy01_saleoutstofhv5_id = '" + soutId + "'";
    var upBillDetails = ObjectStore.queryByYonQL(sqlstr);
    // 判断表体
    var flag = false; // 是否存在可以复查的单据
    //遍历表体
    for (var i = 0; i < upBillDetails.length; i++) {
      sqlstr = "select sum(newReviewQty) as sumqty  from GT22176AT10.GT22176AT10.SY01_quareventryv1  where  sourcechild_id = '" + upBillDetails[i].id + "'";
      var checks = ObjectStore.queryByYonQL(sqlstr);
      // 获取退回单的数量
      var allqty = upBillDetails[i].checkUncertainNum;
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
      return { errInfo: "单据" + request.upBillCode + "不存在需要复查的商品！" };
    }
    // 添加下游单据审核状态校验
    var downSrcuri = "GT22176AT10.GT22176AT10.Sy01_quareview";
    var param = { id: soutId, uri: downSrcuri };
    let checkAuditFun = extrequire("GT22176AT10.publicFunction.checkChildOrderAudit");
    let res = checkAuditFun.execute(param);
    if (res.Info && res.Info.length > 0) {
      return { errInfo: res.Info };
    }
    // 返回校验结果
    return { data: flag };
  }
}
exports({ entryPoint: MyAPIHandler });