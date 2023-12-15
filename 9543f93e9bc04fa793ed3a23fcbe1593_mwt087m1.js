let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let saleOrderDefineSql = "select  * from voucher.order.OrderDetailFreeDefine where id='youridHere'";
    let saleordersList = ObjectStore.queryByYonQL(saleOrderDefineSql, "udinghuo");
    //根据子表id去获取 子表的物料
    let getGood = "select  productId  from  voucher.order.OrderDetail  where  id ='youridHere'";
    var goodRes = ObjectStore.queryByYonQL(getGood, "udinghuo");
    let good = goodRes[0].productId;
    //通过物料id去查货位对照表
    let getAllocationCode = "select positionId from aa.goodsposition.GoodsProductsComparison where productId = '" + good + "'";
    var positionRes = ObjectStore.queryByYonQL(getAllocationCode, "productcenter");
    let arr = [];
    for (var i in positionRes) {
      let positionId = positionRes[i].positionId;
      let getPositionCode = "select name,code from aa.goodsposition.GoodsPosition where id = '" + positionId + "'";
      let PositionCodeRes = ObjectStore.queryByYonQL(getPositionCode, "productcenter");
      arr.push(PositionCodeRes[0].name);
      arr.push(PositionCodeRes[0].code);
    }
    return { goodRes, positionRes, arr };
  }
}
exports({ entryPoint: MyAPIHandler });