let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pritemid_sourcehid = request.pritemid_sourcehid;
    let body = {};
    let url = "https://www.example.com/" + pritemid_sourcehid;
    let apiResponse = openLinker("GET", url, "ycSouringInquiry", JSON.stringify(body));
    let result = JSON.parse(apiResponse).data;
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });