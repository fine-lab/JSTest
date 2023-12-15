let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let body = { id: "youridHere" };
    let apiResponse = openLinker("GET", url, "AT17DC84EC08280005", null);
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });