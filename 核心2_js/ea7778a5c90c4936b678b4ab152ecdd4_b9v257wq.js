let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute() {
    let tenantId = "yourIdHere";
    let url = "https://www.example.com/" + tenantId;
    let strResponse = postman("get", url, JSON.stringify({}), JSON.stringify({}));
    let rsp = JSON.parse(strResponse);
    return rsp;
  }
}
exports({ entryPoint: MyTrigger });