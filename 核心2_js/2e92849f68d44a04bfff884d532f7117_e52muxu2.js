let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let string1 = '{"aa":1234567899876543211}';
    let body = { json: string1 };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT22176AT10", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });