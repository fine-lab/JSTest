let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var data = param.data[0];
    var { id, QuoteType, YJ_NonstandPrice, BS_NonstandPrice, TotalPrice } = data;
    var querySql = "select sum(FBAmt) from GT9604AT11.GT9604AT11.QuoteBill_FBWL where QuoteBill_FBWLFk='" + id + "'";
    var res = ObjectStore.queryByYonQL(querySql);
    //存在非标物料明细金额的值，就将该值存放到主表的“非标加价”字段中，并且修改总价的值
    if (res.length > 0) {
      var object;
      if (QuoteType === "1") {
        TotalPrice = TotalPrice - BS_NonstandPrice + res[0].FBAmt;
        object = { id: id, BS_NonstandPrice: res[0].FBAmt, TotalPrice: TotalPrice };
      } else {
        TotalPrice = TotalPrice - YJ_NonstandPrice + res[0].FBAmt;
        object = { id: id, YJ_NonstandPrice: res[0].FBAmt, TotalPrice: TotalPrice };
      }
      res = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });