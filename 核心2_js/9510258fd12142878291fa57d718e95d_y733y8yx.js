let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let proitems = request.proitems;
    let url = "https://www.example.com/";
    let body = {
      data: {
        id: proitems
      }
    };
    let apiResponse = openLinker("POST", url, "ST", JSON.stringify(body));
    let responseObj = JSON.parse(apiResponse);
    return { responseObj };
  }
}
exports({ entryPoint: MyAPIHandler });