let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var iscallback = data.callback;
    if (iscallback == "1") {
      var orderDetails = data.orderDetails;
      var settlementOrgId = "";
      orderDetails.forEach((dataod) => {
        //查stockId
        let stockCode = dataod.stockCode;
        let sqlsti = "select id from  aa.warehouse.Warehouse where code = '" + stockCode + "'";
        var resdatasti = ObjectStore.queryByYonQL(sqlsti, "productcenter");
        dataod.set("stockId", resdatasti[0].id + "");
        //通过物料编码查productid
        let productCode = dataod.productCode;
        let sqlpro = "select id from pc.product.Product where code = '" + productCode + "'";
        var resdatapro = ObjectStore.queryByYonQL(sqlpro, "productcenter");
        dataod.set("productId", parseInt(resdatapro[0].id) + "");
        //查stockOrgId
        let stockOrgCode = dataod.stockOrgCode;
        let sqlstk = "select id from org.func.BaseOrg where code = '" + stockOrgCode + "'";
        var resdatastk = ObjectStore.queryByYonQL(sqlstk, "ucf-org-center");
        dataod.set("stockOrgId", resdatastk[0].id + "");
        //查settlementOrgId
        let settlementOrgCode = dataod.settlementOrgCode;
        let sqlstt = "select id from org.func.BaseOrg where code = '" + settlementOrgCode + "'";
        var resdatastt = ObjectStore.queryByYonQL(sqlstt, "ucf-org-center");
        dataod.set("settlementOrgId", resdatastt[0].id + "");
        settlementOrgId = resdatastt[0].id;
      });
      //根据订单id（orderId），用yonSQL查客户id(agentId)并对入参的agentId进行赋值
      var id = data.id;
      let sqlAgent = "select agentId  from voucher.order.Order where id = '" + id + "'";
      var resdataAgent = ObjectStore.queryByYonQL(sqlAgent, "udinghuo");
      data.set("agentId", resdataAgent[0].agentId + "");
      data.set("settlementOrgId", parseInt(settlementOrgId) + "");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });