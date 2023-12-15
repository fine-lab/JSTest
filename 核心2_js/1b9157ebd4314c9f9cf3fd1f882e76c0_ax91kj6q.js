let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      fields: ["id", "code", "name", "pk_org"]
    };
    let apiResponse = openLinker("post", url, "GT15699AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });