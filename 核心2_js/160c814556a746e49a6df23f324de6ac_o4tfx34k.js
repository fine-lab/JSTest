let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { textinfo: "value" };
    let header = { textinfo: "value" };
    let apiResponse = postman(
      "post",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return {};
  }
}
exports({ entryPoint: MyTrigger });