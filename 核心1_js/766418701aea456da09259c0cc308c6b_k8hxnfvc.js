let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id; //ycSouringInquiry.backDesignerFunction.queryBuyOffer
    let url = "https://www.example.com/" + id;
    let apiResponse = openLinker("GET", url, "ycSouringInquiry", JSON.stringify({}));
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });