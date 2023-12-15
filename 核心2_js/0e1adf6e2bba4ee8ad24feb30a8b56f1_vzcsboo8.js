let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var receiver = ["d69bb53d-dd7e-4d02-800e-cfcec2c139bd"]; //刘总友互通ID
    var channels = ["uspace"];
    var title = "货币资金异常预警";
    var content = "货币资金应大等于0，越西县中所镇陶家营村货币资金为空值，请联系财务人员确认后处理！";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      receiver: receiver,
      channels: channels,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    var result = sendMessage(messageInfo);
    return { result };
  }
}
exports({ entryPoint: MyAPIHandler });