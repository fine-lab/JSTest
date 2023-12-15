let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let DataResponse = postman("get", "https://www.example.com/" + param, null, null);
    let DataObject = JSON.parse(DataResponse);
    if (DataObject.code == "00000") {
      var gatewayUrl = DataObject.data.gatewayUrl;
      return { Url: gatewayUrl };
    } else {
      throw new Error("获取动态域名失败！");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });