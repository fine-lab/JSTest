let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: []
    };
    let agentId = request.agentId; //客户id
    let salesOrgId = request.salesOrgId; //销售组织
    let priceData = request.priceData || []; //价格对象{row:0,productId:'',price:''}
    try {
      //客户档案业务对象查询 customerLevel客户级别(价格目录)
      let sql1 =
        "select dtl.taxRate taxRate,dtl.collectionAgreement collectionAgreement,dtl.deliveryWarehouse deliveryWarehouse,orgId,dtl.customerLevel customerLevel from aa.merchant.MerchantApplyRange  inner join aa.merchant.MerchantApplyRangeDetail dtl on id=dtl.merchantApplyRangeId inner join aa.merchant.Merchant main on main.id=merchantId where 1=1 and orgId=" +
        salesOrgId +
        " and main.id='" +
        agentId +
        "'";
      let MerchantApplyRangeDetail = ObjectStore.queryByYonQL(sql1, "productcenter");
      let customerLevel = ""; //客户级别(价格表)
      if (MerchantApplyRangeDetail.length > 0) {
        customerLevel = MerchantApplyRangeDetail[0].customerLevel || ""; //客户级别(价格表)
      }
      if (!customerLevel) {
        throw new Error("客户[" + agentId + "],价格表未维护,取价失败！");
      }
      priceData.map((item) => {
        item.price = this.getOriTaxUnitPrice(customerLevel, item.productId);
      });
      rsp.dataInfo = priceData;
    } catch (ex) {
      console.log("错误信息" + ex.toString());
      rsp.code = 500;
      rsp.msg = ex.toString();
    }
    return rsp;
  }
  getOriTaxUnitPrice(agentLevelId, productId) {
    let sql =
      "select code,status,c.name,beginDate,endDate,b.price,b.priceUnit,b.amountUnit,d.exchangeRateType,d.outputRate from marketing.price.PriceAdjustment inner join marketing.price.PriceAdjustDetail b on b.priceAdjustmentId=id inner join marketing.price.PriceTemplate c on c.id=priceTemplateId inner join marketing.price.PriceAdjustDetailDimension d on b.id=d.priceAdjustDetailId where c.name='客户级别+商品'  and status=1 and d.agentLevelId='" +
      agentLevelId +
      "'  and d.productId=" +
      productId +
      "  order by beginDate desc";
    let dt = ObjectStore.queryByYonQL(sql, "marketingbill");
    let oriTaxUnitPrice = 0; //含税单价
    if (dt.length > 0) {
      oriTaxUnitPrice = dt[0].b_price;
    }
    return oriTaxUnitPrice;
  }
}
exports({ entryPoint: MyAPIHandler });