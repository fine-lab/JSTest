let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {};
    let header = {};
    let apiResponse = postman("get", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    apiResponse = JSON.parse(apiResponse);
    throw new Error(apiResponse.data.gatewayUrl);
    return {};
  }
}
exports({ entryPoint: MyTrigger });