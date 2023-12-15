let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var personId = param["variablesMap"]["pk_handlepsn"]; //znbzbx_memoapply_1524906526564679687
    let url = "https://www.example.com/" + personId;
    let apiResponse = openLinker("GET", url, "AT15B538EA16C8000A", "");
    let jsonResponse = JSON.parse(apiResponse); //将返回的内容转成JSON
    let apidata = jsonResponse.data.message; //获取ITAPI返回的内容
    let jsonData = JSON.parse(apidata); //将返回的内容转成JSON
    let returnMessage = jsonData.data;
    var uspaceReceiver = ["08877256-cc89-4e6b-9b97-9151ee3337c6"];
    var channels = ["uspace"];
    var title = "getPersonInfoV1";
    var content = "content";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: JSON.stringify(returnMessage)
    };
    var result = sendMessage(messageInfo);
    return returnMessage;
  }
}
exports({ entryPoint: MyTrigger });