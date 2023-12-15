let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      fields: ["id", "code", "name", "pk_org"]
    };
    let apiResponse = openLinker("POST", url, "GT15699AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });