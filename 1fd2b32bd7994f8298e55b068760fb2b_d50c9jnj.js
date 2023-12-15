let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let orderDetails = data[0].purchaseOrders;
    for (let i = 0; i < orderDetails.length; i++) {
      let extendResItem = orderDetails[i].extendResItem;
      if (extendResItem) {
        // 有囤货出库生成的销售订单，物料已被修改，抛出异常
        if (orderDetails[i].extendResItem != orderDetails[i].product) {
          throw new Error("行号为【" + orderDetails[i].lineno + "】的物料为囤货入库生成的物料，请勿修改物料！");
        }
        // 查询囤货入库剩余数量
        let extendDirectiveId = orderDetails[i].extendDirectiveId;
        let extendTaskDirectiveId = orderDetails[i].extendTaskDirectiveId;
        let sql = "select id,remainingQuantity from AT181E613C1770000A.AT181E613C1770000A.ReservoirIn ";
        sql += " where taskDirectiveId = '" + extendTaskDirectiveId + "'";
        sql += " and directiveId = '" + extendDirectiveId + "' ";
        sql += " and resItemCode = '" + extendResItem + "' ";
        let res = ObjectStore.queryByYonQL(sql, "developplatform");
        if (orderDetails[i].qty > Number(res[0].remainingQuantity)) {
          throw new Error("行号为【" + orderDetails[i].lineno + "】的物料数量大于囤货入库剩余数量，请检查！");
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });