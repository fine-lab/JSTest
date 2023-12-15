let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //单据状态
    var verifystateKey = 5;
    var param = request.ids;
    var failList = [];
    for (var i = param.length - 1; i >= 0; i--) {
      var object = { id: param[i].billId, verifystate: verifystateKey };
      var res = ObjectStore.updateById("GT4691AT1.GT4691AT1.MFrontSaleOrderMain", object, "0966e17f");
      if (res.verifystate != object.verifystate) {
        failList.push(param[i].billCode);
      }
    }
    if (failList.length > 0) {
      throw new Error("单据:" + failList.toString() + " 撤回失败：更新表单状态发生错误");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });