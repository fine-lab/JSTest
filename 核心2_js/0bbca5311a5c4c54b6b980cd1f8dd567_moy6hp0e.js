let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: {
        taxRate: "",
        collectionAgreement: "",
        deliveryWarehouse: "",
        customerLevel: "",
        professSalesman: ""
      }
    };
    let sql = "";
    try {
      sql =
        "select dtl.taxRate taxRate,dtl.collectionAgreement collectionAgreement,dtl.deliveryWarehouse deliveryWarehouse,orgId,dtl.customerLevel customerLevel from aa.merchant.MerchantApplyRange  inner join aa.merchant.MerchantApplyRangeDetail dtl on id=dtl.merchantApplyRangeId inner join aa.merchant.Merchant main on main.id=merchantId where 1=1 and orgId=1664270776207933441 and main.code='" +
        request.agentId +
        "'";
      let dt = ObjectStore.queryByYonQL(sql, "productcenter");
      if (dt.length > 0) {
        rsp.dataInfo.taxRate = dt[0].taxRate;
        rsp.dataInfo.collectionAgreement = dt[0].collectionAgreement;
        rsp.dataInfo.deliveryWarehouse = dt[0].deliveryWarehouse;
        rsp.dataInfo.customerLevel = dt[0].customerLevel;
      }
      //负责人
      sql = "select b.professSalesman professSalesman from aa.merchant.Merchant inner join aa.merchant.Principal b on b.merchantId=id where code='" + request.agentId + "'";
      let professSalesman = ObjectStore.queryByYonQL(sql, "productcenter");
      if (professSalesman.length > 0) {
        rsp.dataInfo.professSalesman = professSalesman[0].professSalesman; //业务员
      }
    } catch (ex) {
      console.log("错误信息" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });