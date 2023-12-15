let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var iscallback = data.callback;
    var id = data.id;
    if (iscallback == "1") {
      var orderDetails = data.orderDetails;
      var settlementOrgId = "";
      var salesOrgId = "";
      var salesOrgId_name = "";
      orderDetails.forEach((dataod) => {
        //查stockId
        let stockCode = dataod.stockCode;
        let sqlsti = "select id from  aa.warehouse.Warehouse where code = '" + stockCode + "'";
        var resdatasti = ObjectStore.queryByYonQL(sqlsti, "productcenter");
        if (resdatasti.length > 0) {
          dataod.set("stockId", resdatasti[0].id + "");
        } else {
          throw new Error("BIP系统中不存在编码为：" + stockCode + "的仓库！");
        }
        //通过物料编码查productid
        let productCode = dataod.productCode;
        let sqlpro = "select id from pc.product.Product where code = '" + productCode + "'";
        var resdatapro = ObjectStore.queryByYonQL(sqlpro, "productcenter");
        if (resdatapro.length > 0) {
          dataod.set("productId", parseInt(resdatapro[0].id) + "");
        } else {
          throw new Error("BIP系统中不存在编码为：" + productCode + "的物料！");
        }
        //查stockOrgId
        let stockOrgCode = dataod.stockOrgCode;
        let sqlstk = "select id from org.func.BaseOrg where code = '" + stockOrgCode + "'";
        var resdatastk = ObjectStore.queryByYonQL(sqlstk, "ucf-org-center");
        if (resdatastk.length > 0) {
          dataod.set("stockOrgId", resdatastk[0].id + "");
        } else {
          throw new Error("BIP系统中不存在编码为：" + stockOrgCode + "的库存组织！");
        }
        //查settlementOrgId
        let settlementOrgCode = dataod.settlementOrgCode;
        let sqlstt = "select id from org.func.BaseOrg where code = '" + settlementOrgCode + "'";
        var resdatastt = ObjectStore.queryByYonQL(sqlstt, "ucf-org-center");
        if (resdatastt.length > 0) {
          dataod.set("settlementOrgId", resdatastt[0].id + "");
          settlementOrgId = resdatastt[0].id;
        } else {
          throw new Error("BIP系统中不存在编码为：" + settlementOrgCode + "的组织！");
        }
        //查salesOrgId
        let sqlsoi = "select salesOrgId  from voucher.order.Order where id = '" + id + "'";
        var resdatasoi = ObjectStore.queryByYonQL(sqlsoi, "udinghuo");
        if (resdatasoi.length > 0) {
          dataod.set("salesOrgId", resdatasoi[0].salesOrgId + "");
          salesOrgId = resdatasoi[0].salesOrgId;
        } else {
          throw new Error("BIP系统中不存在id为：" + id + "的订单，查不到销售组织！");
        }
      });
      //根据订单id（orderId），用yonSQL查客户id(agentId)并对入参的agentId进行赋值
      let sqlAgent = "select agentId,code,agentRelationId,invoiceAgentId  from voucher.order.Order where id = '" + id + "'";
      var resdataAgent = ObjectStore.queryByYonQL(sqlAgent, "udinghuo");
      if (resdataAgent.length > 0) {
        data.set("agentId", resdataAgent[0].agentId + "");
        data.set("invoiceAgentId", resdataAgent[0].invoiceAgentId + "");
        data.set("agentRelationId", resdataAgent[0].agentRelationId + "");
        data.set("code", resdataAgent[0].code + "");
        data.set("settlementOrgId", parseInt(settlementOrgId) + "");
        data.set("salesOrgId", salesOrgId + "");
        data.set("salesOrgId_name", salesOrgId_name + "");
      } else {
        throw new Error("BIP系统中不存在id为：" + id + "的订单！");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });