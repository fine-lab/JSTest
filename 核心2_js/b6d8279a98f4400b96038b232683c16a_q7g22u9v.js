let AbstractTrigger = require("AbstractTrigger");
let queryUtils = extrequire("GT52668AT9.CommonUtils.QueryUtils");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let bill = param.data[0];
    let salesOrgId = bill.salesOrgId;
    let agentId = bill.agentId;
    let curDate = queryUtils.getDateString(new Date());
    if (queryUtils.isEmpty(salesOrgId)) {
      return {};
    }
    let sql = "select define1 " + "from org.func.BaseOrgDefine " + "where id='" + salesOrgId + "' ";
    let orgDefine = ObjectStore.queryByYonQL(sql, "ucf-org-center");
    let define = "";
    if (null != orgDefine && orgDefine.length > 0) {
      define = orgDefine[0].define1;
    }
    if (define != "1" && define != "true") {
      return {};
    }
    sql =
      "select mainid.code as code,mainid.confirmPrice as confirmPrice," +
      "sum(payMoney) as payMoneyAll " +
      "from voucher.order.PaymentExeDetail t " +
      "left join mainid on t.mainid=mainid.id " +
      "where mainid.salesOrgId='" +
      salesOrgId +
      "' " +
      "and mainid.agentId='" +
      agentId +
      "' " +
      "and ifnull(mainid.nextStatus,'')<>'OPPOSE' " +
      "and mainid.payStatusCode<>'FINISHPAYMENT' " + //"and mainid.confirmPrice>0 " +
      "and expiringDateTime<='" +
      curDate +
      "' " +
      "group by mainid.code,mainid.confirmPrice "; // +
    let orderInfos = ObjectStore.queryByYonQL(sql, "udinghuo");
    let orderCode = "";
    for (let i = 0; i < orderInfos.length; i++) {
      let orderInfo = orderInfos[i];
      let code = orderInfo.code;
      let confirmPrice = orderInfo.confirmPrice;
      let payMoneyAll = orderInfo.payMoneyAll;
      if (payMoneyAll > confirmPrice) {
        orderCode = orderCode + (queryUtils.isEmpty(orderCode) ? "" : ",") + code;
      }
    }
    if (!queryUtils.isEmpty(orderCode)) {
      throw new Error("有以下超信用账期的订单，当前订单不可审核或提交。订单号:" + orderCode);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });