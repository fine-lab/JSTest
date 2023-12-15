let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var sql = "select * from AT1716B0DE09100008.AT1716B0DE09100008.orderFusing where id = 1663731706256424960";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    if (result[0].approve == "0") {
      throw new Error("订单熔断,不允许审批");
    }
    let body = {
      roleId: "yourIdHere",
      pageNumber: 1,
      pageSize: 10
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(body));
    const list = JSON.parse(apiResponse).data.list;
    var receiver = [];
    for (const row of list) {
      receiver.push(row.yhtUserId);
    }
    let urlDetails = "https://www.example.com/" + param.convBills[0].id;
    let apiResponseDetails = openLinker("GET", urlDetails, "SCMSA", JSON.stringify({}));
    //订单数据
    var orderData = JSON.parse(apiResponseDetails).data;
    //客户名称
    var customer = orderData.agentId_name;
    const details = orderData.orderDetails;
    var detailsMes = customer;
    for (const row of details) {
      var mes = "  物料:" + row.productName + "  仓库:" + row.stockName + "  司机:" + row.extend176_name + "  销售数量:" + row.priceQty + "  计划发货日期:" + row.consignTime;
      detailsMes = detailsMes + mes;
    }
    var uspaceReceiver = receiver;
    var channels = ["uspace"];
    var title = "销售下单提醒驻库员";
    var content = detailsMes;
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return {};
  }
}
exports({ entryPoint: MyTrigger });