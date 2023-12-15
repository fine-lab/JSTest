let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
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
    var customer = param.return.agentId_name;
    const details = param.return.orderDetails;
    var uspaceReceiver = receiver;
    var channels = ["uspace"];
    var title = "销售下单提醒驻库员测试";
    var content = "销售订单" + customer + "通知库管员，通知库管员，通知库管员";
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