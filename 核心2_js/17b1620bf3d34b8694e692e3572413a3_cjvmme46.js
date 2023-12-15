let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    // 查询销售退货是否存在该回签单
    let SaleReturnFreeDefineSql = "select salereturnDefineCharacter.headDefine8 from	voucher.salereturn.SaleReturn	where salereturnDefineCharacter.headDefine8 = '" + id + "'";
    let SaleReturnFreeDefineRes = ObjectStore.queryByYonQL(SaleReturnFreeDefineSql, "udinghuo");
    if (SaleReturnFreeDefineRes.length > 0) {
      return { ErrorCode: 1 };
    }
    return { ErrorCode: 0 };
  }
}
exports({ entryPoint: MyAPIHandler });