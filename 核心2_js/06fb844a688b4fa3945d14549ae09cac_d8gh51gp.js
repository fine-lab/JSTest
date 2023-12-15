let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var bodyData = request.bodyData; //样本信息
    var nowTime = request.nowTime; //时分秒
    var querySql = "select id from voucher.order.OrderDefineCharacter where attrext2='" + bodyData.id + "'";
    var res = ObjectStore.queryByYonQL(querySql, "udinghuo");
    if (res.length > 0) {
      //存在下游销售订单
      throw new Error("存在下游销售订单");
    }
    var newyangbenbianhao = "作废" + nowTime + "-" + bodyData.yangbenbianhao;
    //更新收样管理信息中的【收样单状态】为作废
    var newzuofeiyuanyinValue = request.zuofeiyuanyinValue;
    let bodyUpdate = { id: bodyData.id, zhuangtai: "50", yangbenbianhao: newyangbenbianhao, zuofeiyuanyin: newzuofeiyuanyinValue };
    let updateRes = ObjectStore.updateById("AT15F164F008080007.AT15F164F008080007.recDetils1", bodyUpdate, "63fb1ae5");
    return { request };
  }
}
exports({ entryPoint: MyAPIHandler });