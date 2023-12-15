let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取请求参数
    var goodsOrder = request.goodsOrder;
    // 校验参数
    var newGoodsOrder = checkParams(goodsOrder);
    var res = ObjectStore.updateBatch("AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder", newGoodsOrder, "ybde540054");
    return { res };
  }
}
function checkParams(params) {
  //根据小票号换取id
  var newGoodsOrder = [];
  for (var i = 0; i < params.length; i++) {
    let goodsOrder = params[i];
    let id = goodsOrder.id;
    let sql = "select id from AT16879EEA1CB0000A.AT16879EEA1CB0000A.goodsOrder where smallBillNumber = '" + id + "' or id = '" + id + "'";
    var res = ObjectStore.queryByYonQL(sql);
    goodsOrder.id = res[0].id;
    newGoodsOrder.push(goodsOrder);
  }
  return newGoodsOrder;
}
exports({ entryPoint: MyAPIHandler });