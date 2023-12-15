let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //单据状态
    var verifystateKey = 0;
    var object = { id: param.data[0].id, verifystate: verifystateKey };
    var res = ObjectStore.updateById("GT4691AT1.GT4691AT1.MFrontSaleOrderMain", object, "0966e17f");
    if (res.verifystate != object.verifystate) {
      throw new Error("撤回失败：更新表单状态发生错误");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });