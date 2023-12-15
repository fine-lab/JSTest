let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { id: "youridHere" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT168D900209980004", JSON.stringify({ id: "youridHere" }));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });