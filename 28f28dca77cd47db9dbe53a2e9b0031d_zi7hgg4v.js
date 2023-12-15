let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let body = {};
    var tokenResponse = postman(
      "post",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { tokenResponse };
  }
}
exports({ entryPoint: MyTrigger });