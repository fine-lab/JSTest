let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let a = { a: request };
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "SCMSA", JSON.stringify(a));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });