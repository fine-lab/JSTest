let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let headertoken = {
      "Content-Type": "application/json; charset=utf-8"
    };
    let bodytoken = {
      app_id: "youridHere",
      app_secret: "yoursecretHere"
    };
    let tokenObject = postman("post", "https://www.example.com/", JSON.stringify(headertoken), JSON.stringify(bodytoken));
    var jsonValue = JSON.parse(tokenObject);
    let token = jsonValue.tenant_access_token;
    //生成uuid
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    //信息体
    let body = {
      receive_id: "youridHere",
      msg_type: "text",
      content: '{"text":"测试通过https://itunes.apple.com/cn/app/qi-ye-kong-jian-esn/id960672631?mt=8啊啊啊啊"}',
      uuid: uuid
    };
    //信息头
    let header = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json; charset=utf-8"
    };
    // 可以直观的看到具体的错误信息
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });