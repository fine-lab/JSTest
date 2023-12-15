let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = JSON.parse(openLinker("GET", url + "?" + "id" + "=" + request.id + "&" + "orgId" + "=" + "666666", "AT17AA2EFA09C00009", null));
    let data = apiResponse.data.productAssistUnitExchanges;
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });