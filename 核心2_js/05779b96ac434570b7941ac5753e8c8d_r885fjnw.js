let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = { Documentsid: "aaaa", Documentstype: "bbb", creater: "cccc", mark: "dddd" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT16976F5409A00009", body);
    return { body };
  }
}
exports({ entryPoint: MyTrigger });