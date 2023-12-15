let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 查询sql
    var querySql = "select * from GT80750AT4.GT80750AT4.sale_order_record where 1=1 and is_success = '否' ";
    // 返回信息
    var res = ObjectStore.queryByYonQL(querySql);
    // 响应
    if (res === undefined || res.length < 1) {
      return {};
    }
    res.forEach((self, index) => {
      let asynRes = extrequire("GT80750AT4.saleOrderSaveFunction.asynSaveSaleOrder").execute({
        data: self.sale_order_data
      });
      if (asynRes.code !== 200) {
        throw new Error(asynRes.message);
      }
    });
    return {};
  }
}
exports({ entryPoint: MyTrigger });