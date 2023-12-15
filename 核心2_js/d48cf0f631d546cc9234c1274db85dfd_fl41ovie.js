let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(request) {
    var strResponse = postman("post", "https://www.example.com/", '{"Content-Type":"multipart/form-data"}', JSON.stringify(request.data));
    return {};
  }
}
exports({ entryPoint: MyTrigger });