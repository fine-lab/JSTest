let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {
      pageIndex: 1,
      pageSize: 10
    };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("GET", url, "AT189AC64216F80002", JSON.stringify(body));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });