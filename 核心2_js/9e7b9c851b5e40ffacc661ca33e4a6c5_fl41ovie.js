let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(req) {
    var strResponse = postman("post", "https://www.example.com/", '{"Content-Type":"multipart/form-data"}', JSON.stringify(req.data));
  }
}
exports({ entryPoint: MyTrigger });