let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 正式
    // 测试
    var map = {
      nccUrl: "https://ncc-test.49icloud.com:8080",
      bipSelfUrl: "https://www.example.com/",
      busUrl: "https://www.example.com/",
      busAppKey: "yourKeyHere",
      busAppSecret: "yourSecretHere"
    };
    return map;
  }
}
exports({ entryPoint: MyAPIHandler });