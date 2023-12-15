let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param, stepCode) {
    var personId = param["variablesMap"]["initiator"];
    let url = "https://www.example.com/" + personId;
    let apiResponse = openLinker("GET", url, "GT2484AT1", "");
    let jsonResponse = JSON.parse(apiResponse); //将返回的内容转成JSON
    let apidata = jsonResponse.data.message; //获取ITAPI返回的内容
    let jsonData = JSON.parse(apidata); //将返回的内容转成JSON
    let returnMessage = jsonData.message; //获取返回值
    //调试： 发送邮件给管理员
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "BIP-getPersonLevel",
      content: jsonResponse
    };
    var result = sendMessage(messageInfo);
    return returnMessage;
  }
}
exports({ entryPoint: MyTrigger });