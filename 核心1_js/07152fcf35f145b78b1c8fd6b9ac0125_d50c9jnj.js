let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data;
    let orderDetails = data[0].orderDetails;
    for (let i = 0; i < orderDetails.length; i++) {
      if (orderDetails[i].extendOutItem) {
        // 有囤货出库生成的销售订单，物料已被修改，抛出异常
        if (orderDetails[i].extendOutItem != orderDetails[i].productId) {
          throw new Error("行号为【" + orderDetails[i].lineno + "】的物料为囤货出库生成的物料，请勿修改物料！");
        }
        // 有囤货出库生成的销售订单，数量>囤货出库剩余数量，抛异常
        // 查询囤货出库未关联剩余数量
        let extendOutId = orderDetails[i].extendOutId;
        let outFlag = extendOutId.split("@_@");
        let sql = "select id,leftOutCount from AT181E613C1770000A.AT181E613C1770000A.ReservoirOut ";
        sql += " where taskDirectiveId = '" + outFlag[0] + "'";
        sql += " and directiveId = '" + outFlag[1] + "' ";
        if (outFlag[2]) {
          // 批次号不为空
          sql += " and batchNumber = '" + outFlag[2] + "' ";
        }
        let res = ObjectStore.queryByYonQL(sql, "developplatform");
        if (orderDetails[i].qty > Number(res[0].leftOutCount)) {
          throw new Error("行号为【" + orderDetails[i].lineno + "】的物料数量大于囤货出库未关联剩余数量，请检查！");
        }
        orderDetails[i].set("extendOutNum", Number(res[0].leftOutCount));
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });