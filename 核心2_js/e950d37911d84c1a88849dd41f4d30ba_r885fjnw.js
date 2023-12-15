let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "znbzbx_expensebill", JSON.stringify({}));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });