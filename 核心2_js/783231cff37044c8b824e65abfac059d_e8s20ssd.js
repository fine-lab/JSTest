let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 可以弹出具体的信息（类似前端函数的alert）
    var data = param.data[0];
    //查询订单子表数据，列表无法直接获取子表数据
    var oderid = data.id;
    var object = { orderId: oderid };
    var res = ObjectStore.selectByMap("voucher.order.OrderDetail", object);
    //重新查询订单主表数据，列表获取的数据不对
    var newid = { id: oderid };
    var newdata = ObjectStore.selectByMap("voucher.order.Order", newid);
    //销售组织编码转换
    var salesOrgId = { id: newdata[0].salesOrgId };
    var salesOrg = ObjectStore.selectByMap("org.func.SalesOrg", salesOrgId);
    newdata[0].salesOrgId_code = salesOrg[0].code;
    newdata[0].salesOrgId_name = salesOrg[0].name;
    //销售部门编码转换
    var saleDepartmentId = { id: newdata[0].saleDepartmentId };
    var saleDepartment = ObjectStore.selectByMap("bd.adminOrg.AdminOrgVO", saleDepartmentId);
    newdata[0].saleDepartmentId_code = saleDepartment[0].code;
    //财务组织编码转换
    var settlementOrgId = { id: newdata[0].settlementOrgId };
    var settlementOrg = ObjectStore.selectByMap("org.func.SalesOrg", settlementOrgId);
    newdata[0].settlementOrgId_code = settlementOrg[0].code;
    //开票客户编码转换
    var invoiceAgentId = { id: newdata[0].invoiceAgentId };
    var invoiceAgent = ObjectStore.selectByMap("aa.merchant.Merchant", invoiceAgentId);
    newdata[0].invoiceAgentId_code = invoiceAgent[0].code;
    //客户编码转换
    var agentId = { id: newdata[0].agentId };
    var agent = ObjectStore.selectByMap("aa.merchant.Merchant", agentId);
    newdata[0].agentId_code = agent[0].code;
    var code = newdata[0].code;
    //获取币种，赋值币种
    //获取币种，赋值币种
    if (includes(JSON.stringify(param), "SDK_AFTER_CREDIT_RESULT")) {
      //获取币种名称
      newdata[0].originalCode = param.SDK_AFTER_CREDIT_RESULT.calcModel.afterResult[0].currencyName;
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
      newdata[0].stockOrgId_code = stockOrg[0].code;
      //表体自定义项1联系人查询 add by ssz 特征升级，换方式取自定义项1=供货方联系人
      var orderDetailDefineCharacter = res[i].orderDetailDefineCharacter;
      var orderDetaildefineflag = includes(JSON.stringify(orderDetailDefineCharacter), "bodyDefine1");
      if (orderDetaildefineflag) {
        res[i].define1 = orderDetailDefineCharacter.bodyDefine1;
      } else {
        throw new Error("单据号为:" + code + "的单据供货方联系人不能为空！");
      }
    }
    var base_path = "http://117.145.186.110:9080/servlet/saveQuotationServlet";
    let header = { "Content-type": "application/json" };
    var body = {
      data: newdata[0],
      orderDetails: res
    };
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