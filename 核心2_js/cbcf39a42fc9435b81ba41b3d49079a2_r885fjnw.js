let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let header = {};
    let apiResponse = apiman(
      "post",
      "https://www.example.com/",
      JSON.stringify(header),
      JSON.stringify(body)
    );
    return { apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });