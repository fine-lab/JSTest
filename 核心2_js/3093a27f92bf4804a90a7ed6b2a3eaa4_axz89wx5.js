let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let tenantId = ObjectStore.user().tenantId;
    let getBipUrl = "https://www.example.com/" + tenantId;
    let header = { "content-type": "application/json;charset=utf-8" };
    let bipUrlResponse = postman("get", getBipUrl, JSON.stringify(header), null);
    bipUrlResponse = JSON.parse(bipUrlResponse);
    let bipUrl = bipUrlResponse.data.gatewayUrl;
    return { urlHead: bipUrl };
  }
}
exports({ entryPoint: MyTrigger });