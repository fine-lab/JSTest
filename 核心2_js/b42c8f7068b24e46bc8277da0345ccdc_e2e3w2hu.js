let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let url = "https://www.example.com/";
    let apiResponse = JSON.parse(openLinker("GET", url + "?" + "id" + "=" + "1734192311206674437" + "&" + "orgId" + "=" + "666666", "AT17AA2EFA09C00009", null));
    let conversion_array = apiResponse.data.productAssistUnitExchanges;
    let conversion = conversion_array[0].mainUnitCount;
    return { conversion };
  }
}
exports({ entryPoint: MyAPIHandler });