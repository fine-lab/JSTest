let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { tenantId: "yourIdHere", yhtUserId: JSON.parse(AppContext()).currentUser.id, appId: "0", businessKey: JSON.parse(param.requestData).code };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT51140AT18", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyTrigger });