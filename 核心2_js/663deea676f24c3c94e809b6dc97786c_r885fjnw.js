let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = { pageIndex: 1, pageSize: 10, searchcode: "18179315806" };
    let url = "https://www.example.com/";
    let apiResponse = openLinker("POST", url, "AT1631132808680009", JSON.stringify(body));
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });