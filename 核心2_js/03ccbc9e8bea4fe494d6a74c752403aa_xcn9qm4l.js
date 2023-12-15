let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let detailsList = new Array();
    //整单金额
    var sumPreAmount = 0;
    //整单数量
    var sumamountQty = 0;
    for (var i = 0; i < request.data.sales_ReportDetailsList.length; i++) {
      let details = {
        product: request.data.sales_ReportDetailsList[i].product, //物料id或编码
        productsku: request.data.sales_ReportDetailsList[i].productsku, //商品SKUid或编码
        invExchRate: request.data.sales_ReportDetailsList[i].invExchRate, //换算率
        qty: request.data.sales_ReportDetailsList[i].qty, //数量
        stockUnit: request.data.sales_ReportDetailsList[i].stockUnit, //库存单位id
        oriSum: request.data.sales_ReportDetailsList[i].oriSum, //含税金额
        priceUOM: request.data.sales_ReportDetailsList[i].priceUOM, //计价单位id或编码
        taxId: request.data.sales_ReportDetailsList[i].taxId, //税目id或编码
        paidInAmount: request.data.sales_ReportDetailsList[i].paidInAmount, //实收金额
        qtyAdditionalDishes: request.data.sales_ReportDetailsList[i].qtyAdditionalDishes, //赠菜数量
        preAmount: request.data.sales_ReportDetailsList[i].preAmount, //优惠金额
        amountQty: request.data.sales_ReportDetailsList[i].amountQty, //赠菜金额
        receivedQuantity: request.data.sales_ReportDetailsList[i].receivedQuantity, //实收数量
        unitPrice: request.data.sales_ReportDetailsList[i].unitPrice, //单价
        specifications: request.data.sales_ReportDetailsList[i].specifications, //规格
        classification: request.data.sales_ReportDetailsList[i].classification //物料分类
      };
      detailsList.push(details);
      sumamountQty = sumamountQty + details.receivedQuantity;
      sumPreAmount = sumPreAmount + details.paidInAmount;
    }
    let requestBody = {
      accountOrg: request.data.accountOrg, //会计主体
      salesOrg: request.data.salesOrg, //销售组织
      org: request.data.org, //发货组织
      org_id: request.data.org_id, //主组织Id
      invoiceOrg: request.data.invoiceOrg, //开票组织
      vouchdate: request.data.vouchdate, //单据日期
      warehouse: request.data.warehouse, //仓库Id
      natCurrency: request.data.natCurrency, //本币id或编码
      currency: request.data.currency, //币种id或编码
      pushDown: request.data.pushDown, //是否下推
      sales_ReportDetailsList: detailsList, //子表数据
      orderQuantity: sumamountQty, //整单数量
      orderAmount: sumPreAmount //整单金额
    };
    var res = ObjectStore.insert("GT5646AT1.GT5646AT1.sales_Report", requestBody, "12015f78");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });