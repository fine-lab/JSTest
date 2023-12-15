let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let destination = "19168482024";
    let chatbotId = "sip:10659885887900010191@botplatform.rcs.vnet.cn";
    let appSecret = "yourSecretHere";
    let appKey = "yourKeyHere";
    let timestamp = "20210624205034234";
    let header = new Object();
    header.appKey = "yourKeyHere";
    header.timestamp = "20210624205034234";
    header.sign = capitalizeEveryWord(MD5Encode(appKey + appSecret + timestamp));
    let body = {
      sender: chatbotId,
      destination: destination,
      messageType: "text",
      messageData: {
        contentEncoding: "utf8",
        contentText: "5G 消息测试"
      }
    };
    let url = "https://www.example.com/" + URLEncoder(chatbotId);
    let stringHeader = JSON.stringify(header);
    let stringBody = JSON.stringify(body);
    let apiResponse = postman("post", url, stringHeader, stringBody);
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });