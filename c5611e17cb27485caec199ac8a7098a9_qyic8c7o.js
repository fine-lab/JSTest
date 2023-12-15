let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let body = {};
    let url = "https://www.example.com/" + request.id;
    let apiResponse = openLinker("GET", url, "AT16A11A2C17080008", JSON.stringify(body));
    return {
      apiResponse
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});