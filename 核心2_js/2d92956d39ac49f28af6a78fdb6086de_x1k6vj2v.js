let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var json = JSON.stringify(param);
    var id = param.variablesMap.id;
    var strResponse = postman("get", "https://www.example.com/" + id, null, json);
    if (strResponse.status != 200) {
      return {};
    }
    return { context, param };
  }
}
exports({ entryPoint: MyTrigger });