let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = [{ aaa: "启用的客户" }];
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "GT84686AT193", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyTrigger });