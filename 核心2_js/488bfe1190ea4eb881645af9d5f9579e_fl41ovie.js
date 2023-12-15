let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var strResponse = postman("post", "https://www.example.com/", '{"Content-Type":"multipart/form-data"}', JSON.stringify(param.data));
    return {};
  }
}
exports({ entryPoint: MyTrigger });