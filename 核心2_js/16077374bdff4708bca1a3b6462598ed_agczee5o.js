let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = param.data || [];
    if (data.length > 0) {
      data.forEach((saleOrder) => {
        let { id } = saleOrder;
        if (!id) {
          throw new Error("未获取到销售订单id ！！！");
        }
        var item = ObjectStore.queryByYonQL(`select bodyFreeItem.*,* from voucher.order.OrderDetail where orderId = ${id}`);
        let filterData = item.filter((i) => (i.bodyFreeItem_define11 || 0) > 0);
        if (filterData.length > 0) {
          throw new Error(" 存在订单核销金额>0的行，禁止删除 ！！！");
        }
        // 调用 销售订单删除后的逻辑
        let func1 = extrequire("SCMSA.backDefaultGroup.OpenApiUtil");
        let res = func1.execute({
          url: "saleOrder/deleteRule",
          params: { saleOrderId: id + "" }
        });
        if (res.code != "200") {
          throw new Error(res.message || "删除规则异常！");
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });