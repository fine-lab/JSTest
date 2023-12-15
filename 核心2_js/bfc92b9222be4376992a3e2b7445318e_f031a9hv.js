let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 正式
    var map = {
      nccUrl: "https://ncc.ssjf49.com",
      bipSelfUrl: "https://www.example.com/",
      busUrl: "https://www.example.com/",
      busAppKey: "yourKeyHere",
      busAppSecret: "yourSecretHere"
    };
    // 测试
    return map;
  }
}
exports({ entryPoint: MyAPIHandler });