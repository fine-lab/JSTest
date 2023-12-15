let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    var strResponse = postman("post", "https://www.example.com/", JSON.stringify({}), JSON.stringify(request.data));
    return {};
  }
}
exports({ entryPoint: MyTrigger });