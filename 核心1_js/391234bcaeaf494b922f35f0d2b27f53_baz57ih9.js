let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var businessKey = param["businessKey"]; //znbzbx_memoapply_1524906526564679687
    var pk_billtype = param.variablesMap["pk_billtype"];
    var applyid = replace(businessKey, pk_billtype + "_", "");
    var applytype = replace(pk_billtype, "znbzbx_", "");
    let url = "https://www.example.com/" + applytype + "&applyId=" + applyid + "&tenantId=DCD14366452823ED8E114BF1CFADB47D";
    let apiResponse = openLinker("GET", url, "GT1408AT2", "");
    let jsonResponse = JSON.parse(apiResponse);
    let apidata = jsonResponse.data.message;
    let jsonData = JSON.parse(apidata);
    let returnMessage = jsonData.message;
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["mail"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "apiResponse",
      content: returnMessage
    };
    var result = sendMessage(messageInfo);
    return returnMessage;
  }
}
exports({ entryPoint: MyTrigger });