let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    for (var prop in request.rows) {
      //查询当前状态是否符合要求
      var sql = "select * from GT4691AT1.GT4691AT1.MFrontSaleOrderMain where id = '" + request.rows[prop].id + "'";
      var resObj = ObjectStore.queryByYonQL(sql);
      if (resObj.length <= 0) {
        throw new Error("单据校验失败，请刷新后重试");
      }
      //未审核的单据不能进行收款更新
      var money = parseFloat(request.money);
      var object = { id: resObj[0].id, fmReceivedAmount: money, fmReceiptSummary: request.memo };
      var res = ObjectStore.updateById("GT4691AT1.GT4691AT1.MFrontSaleOrderMain", object, "a497e816");
      if (res.length <= 0) {
        throw new Error("收款更新失败：" + JSON.stringify(res));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });