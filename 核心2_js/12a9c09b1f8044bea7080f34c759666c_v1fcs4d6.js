let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var proid = request.proid;
    var agentId = request.agentId;
    var orgid = request.orgId;
    let returnData = {};
    //依据组织、客户id查询对应的平均价设置
    let queryChooseSql =
      "select kaishiriqi,jieshuriqi from GT83441AT1.GT83441AT1.avgMoneyChoose left join GT83441AT1.GT83441AT1.avgMoneyChoose_b b on id=b.avgMoneyChoose_id where  b.dr=0 and b.customer='" +
      agentId +
      "' and dr=0 and org_id='" +
      orgid +
      "'";
    var chooseRes = ObjectStore.queryByYonQL(queryChooseSql, "developplatform");
    if (chooseRes.length == 0) {
      returnData = { code: 200, avgmoney: null };
    } else if (chooseRes.length > 1) {
      returnData = { code: 999, message: "查询平均销售价异常，该客户存在存在多个【平均价设置】！" };
    } else {
      let kaishiriqiDate = chooseRes[0].kaishiriqi;
      let jieshuriqiDate = chooseRes[0].jieshuriqi;
      //查询销售订单订单状态不为“开立”、“审批中”的数据
      let queyAvgSql =
        "select avg(oriTaxUnitPrice) avgmoney from voucher.order.OrderDetail where orderId in (select id from voucher.order.Order where agentId=" +
        agentId +
        " and nextStatus not in ('CONFIRMORDER','APPROVING') and  (vouchdate>='" +
        kaishiriqiDate +
        "' and vouchdate <='" +
        jieshuriqiDate +
        "')) and productId=" +
        proid;
      var avgRes = ObjectStore.queryByYonQL(queyAvgSql, "udinghuo");
      if (avgRes.length == 0) {
        returnData = { code: 200, avgmoney: 0 };
      } else {
        let avgmoney = Number(avgRes[0].avgmoney).toFixed(2);
        returnData = { code: 200, avgmoney: avgmoney };
      }
    }
    return { returnData };
  }
}
exports({ entryPoint: MyAPIHandler });