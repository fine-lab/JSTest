let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let body = {};
    var strResponse = postman(
      "post",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { strResponse };
  }
}
exports({ entryPoint: MyTrigger });