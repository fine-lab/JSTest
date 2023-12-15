let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let DataResponse = postman("get", "https://www.example.com/", null, null);
    let DataObject = JSON.parse(DataResponse);
    if (DataObject.code == "00000") {
      var gatewayUrl = DataObject.data.gatewayUrl;
      return { URL: gatewayUrl };
    } else {
      throw new Error("获取动态域名失败！");
    }
  }
}
exports({ entryPoint: MyTrigger });