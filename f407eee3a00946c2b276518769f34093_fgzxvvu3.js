let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { orderProducts } = request;
    if (!orderProducts) {
      return {};
    }
    var productIds = [];
    var batchNos = [];
    for (var item of orderProducts) {
      if (!item.batchNo) {
        continue;
      }
      if (productIds.indexOf(item.productId) == -1) {
        productIds.push(item.productId);
      }
      if (batchNos.indexOf(item.batchNo) == -1) {
        //注意两者的区别：batchNo在库里是字符类型，需要转为字符类型
        batchNos.push("'" + item.batchNo + "'");
      }
    }
    if (batchNos.length == 0) {
      return {};
    }
    var sql = "select id,productId,batchNo from po.order.OrderProduct where  productId in (" + productIds + ") and batchNo in (" + batchNos + ")";
    var res = ObjectStore.queryByYonQL(sql);
    if (res) {
      return { res };
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });