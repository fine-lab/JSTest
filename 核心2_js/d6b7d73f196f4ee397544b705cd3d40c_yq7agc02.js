let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var query1 = "select * from st.salesout.SalesOut where code='XSCK20230211000076'";
    var ttRes = ObjectStore.queryByYonQL(query1, "ustock");
    var idnumber = ttRes[0].id;
    //销售发货
    var querySalesOut = "select * from  st.salesout.SalesOut where id='" + idnumber + "'";
    var salesOutRes = ObjectStore.queryByYonQL(querySalesOut, "ustock");
    var srcBillNO = salesOutRes[0].srcBillNO; //销售发货单单号
    //销售订单
    //查询销售发货单的来源单据号(纷享销客销售订单id)
    var queryOrderId = "select orderId,id,payMoney from  voucher.delivery.DeliveryVoucher where code='" + srcBillNO + "'";
    var orderRes = ObjectStore.queryByYonQL(queryOrderId, "udinghuo");
    var orderId = orderRes[0].orderId; //销售发货单来源单据号
    //查询销售订单的业务员、部门
    var queryOrderSql = "select corpContact,saleDepartmentId,code from voucher.order.Order where id='" + orderId + "'";
    var orderRes = ObjectStore.queryByYonQL(queryOrderSql, "udinghuo");
    var codeValue = orderRes[0].code;
    var listStr = new Array();
    var queryDataSql = "select * from st.salesout.SalesOuts where mainid='" + idnumber + "'";
    var dataRes = ObjectStore.queryByYonQL(queryDataSql, "ustock");
    for (var i = 0; i < dataRes.length; i++) {
      let bodydata = dataRes[i];
      //销售发货单子表id
      let sourceautoid = bodydata.sourceautoid;
      var querybodySql = "select * from voucher.delivery.DeliveryDetail where id='" + sourceautoid + "'";
      var bodyRes = ObjectStore.queryByYonQL(querybodySql, "udinghuo");
      let sourceautoidValue = bodyRes[0].sourceautoid; //销售订单子表id
      let orderIdValue = bodyRes[0].orderId; //销售订单主表id
      var tt = {
        来源单据子表id: bodydata.id,
        订单id: orderIdValue,
        订单明细ID: sourceautoidValue
      };
      listStr.push(tt);
    }
    var tt = {
      来源单据主键: idnumber,
      来源单据号: ttRes[0].code,
      销售部门: orderRes[0].saleDepartmentId,
      业务员: orderRes[0].corpContact,
      list: listStr
    };
    var ss = "发货单：" + srcBillNO + ",订单：" + codeValue;
    throw new Error(JSON.stringify(tt));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });