let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var uspaceReceiver = request.userid;
    var channels = ["uspace"];
    var title = "交付工单系统工作通知";
    var content = "";
    if (request.isnoflag == "1") {
      //处理人工单转单
      content = request.userName + "分派了工单给您，请您处理,工单号为" + request.ticket_id;
    }
    if (request.isnoflag == "2") {
      //处理人解决
      content = request.userName + "已经针对您提交的工单提供了解决方案,工单号为" + request.ticket_id;
    }
    if (request.isnoflag == "3") {
      //处理人撤回
      content = request.userName + "已经撤回了您提交的问题,工单号为" + request.ticket_id;
    }
    if (request.isnoflag == "") {
      //工单提交人
      content = request.userName + "提交了工单问题,请尽快处理,工单号为" + request.ticket_id;
    }
    if (request.isnoflag == "0") {
      //工单提交人撤回
      content = request.userName + "退回了您处理的工单,请尽快处理,工单号为" + request.ticket_id;
    }
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });