let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 可以弹出具体的信息（类似前端函数的alert）
    var data = param.data[0];
    var oderid = data.id;
    //销售订单表体查询，界面上无法获取订单表体数据
    var object = { orderId: oderid };
    var res = ObjectStore.selectByMap("voucher.order.OrderDetail", object);
    var code = data.code;
    //获取币种，赋值币种
    if (includes(JSON.stringify(param), "realModelData")) {
      var realModelData = param.realModelData[0];
      var orderPrices = realModelData.orderPrices[0];
      param.data[0].originalCode = orderPrices.originalCode;
    }
    //获取币种，赋值币种
    if (includes(JSON.stringify(param), "convBills")) {
      var convBills = param.convBills[0];
      var orderPrices = convBills.orderPrices[0];
      param.data[0].originalCode = orderPrices.originalCode;
    }
    //获取币种，赋值币种
    if (includes(JSON.stringify(param), "SDK_AFTER_CREDIT_RESULT")) {
      param.data[0].originalCode = param.SDK_AFTER_CREDIT_RESULT.calcModel.afterResult[0].currencyCode;
    }
    for (var i = 0; i < res.length; i++) {
      //仓库编码转换
      var wareid = { id: res[i].stockId };
      var wareflag = includes(JSON.stringify(wareid), "id");
      if (wareflag) {
        var warehouse = ObjectStore.selectByMap("aa.warehouse.Warehouse", wareid);
        res[i].stockCode = warehouse[0].code;
      }
      //库存组织编码转换
      var stockOrgId = { id: res[i].stockOrgId };
      var stockOrg = ObjectStore.selectByMap("org.func.InventoryOrg", stockOrgId);
      param.data[0].stockOrgId_code = stockOrg[0].code;
      //表体自定义项1联系人查询
      var orderDetailId = { orderDetailId: res[i].id };
      var orderDetaildefine = ObjectStore.selectByMap("voucher.order.OrderDetailDefine", orderDetailId);
      var orderDetaildefineflag = includes(JSON.stringify(orderDetaildefine), "define1");
      if (orderDetaildefineflag) {
        res[i].define1 = orderDetaildefine[0].define1;
      } else {
        throw new Error("单据号为:" + code + "的单据供货方联系人不能为空！");
      }
    }
    var base_path = "http://117.145.189.234:9080/servlet/saveQuotationServlet";
    let header = { "Content-type": "application/json" };
    var body = {
      data: data,
      orderDetails: res
    };
    throw new Error(JSON.stringify(body));
    // 调用api函数
    let apiResponse = postman("post", base_path, JSON.stringify(header), JSON.stringify(body));
    var result = JSON.stringify(apiResponse);
    var flag = includes(result, "tlsytrue");
    if (!flag) {
      throw new Error("销售订单保存NC报价单失败：错误信息为：" + result);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });