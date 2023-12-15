let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code;
    // 是否存在 0不存在 1存在
    let SalesSql =
      "select *,(select saleReturnId,id,stockId,qty,productCode,productId,salesOutId,salesOutCode,stockOrgId,iProductAuxUnitId,iProductUnitId,masterUnitId,invExchRate,invPriceExchRate from saleReturnDetails) from voucher.salereturn.SaleReturn where verifystate = '2' and code='" +
      code +
      "'";
    let SaleRes = ObjectStore.queryByYonQL(SalesSql, "udinghuo");
    if (SaleRes.length > 0) {
      return { SalesIsEx: 1, SaleRes: SaleRes };
    }
    return { SalesIsEx: 0 };
  }
}
exports({ entryPoint: MyAPIHandler });