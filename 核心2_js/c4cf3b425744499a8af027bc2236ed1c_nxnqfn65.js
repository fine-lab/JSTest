let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var message = null;
    if (request.customer == undefined || request.customer == "") {
      message = "客户不能为空";
    }
    var sql =
      "select rpbInStock,MProductTag,tagName,MProductTag.code as MProductTag_code,rpBU,sum(rpQuantity),sum(rpAftQuantity),sum(rpQuantity-rpAftQuantity) as rpUseQuantity  from GT4691AT1.GT4691AT1.MRebateAmountLog where rgCustomer='" +
      request.customer +
      "' and rpLegalEntity='" +
      request.legalEntity +
      "'  and rpAftQuantity>0  ";
    if (request.fmBU != undefined && request.fmBU != "") {
      sql += " and rpBU = '" + request.fmBU + "'";
    }
    sql += " group by MProductTag,tagName,rpBU,rpbInStock";
    var res = ObjectStore.queryByYonQL(sql);
    //将执行SQL从接口抛出，方便排查问题，生产环境可以不加
    return { result: res, sql: sql };
  }
}
exports({ entryPoint: MyAPIHandler });