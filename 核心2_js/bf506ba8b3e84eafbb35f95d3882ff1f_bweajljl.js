let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var url = "https://www.example.com/";
    var header = { "Content-Type": "application/json;charset=UTF-8" };
    var body = {
      funcType: "orgunit",
      id: param
    };
    let apiResponse = openLinker("post", url, "GT15699AT1", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });